from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
from PIL import Image
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health():
    return {"status": "ok"}


def analyze_image(image_bytes):
    # Load image
    img = Image.open(io.BytesIO(image_bytes)).convert("L")  # grayscale
    img_np = np.array(img)

    # Resize for consistency
    img_np = cv2.resize(img_np, (400, 400))

    # Edge detection (simulates bone boundary detection)
    edges = cv2.Canny(img_np, 50, 150)

    # Find contours (simulates segmentation)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    if not contours:
        femur_width = 60
        tibia_width = 55
    else:
        # Use largest two contours as femur/tibia proxies
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:2]
        widths = []
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            widths.append(w)
        widths += [60] * (2 - len(widths))  # fallback if only 1 contour found
        femur_width, tibia_width = widths[0], widths[1]

    # Ratio-based OA severity heuristic
    ratio = min(femur_width, tibia_width) / max(femur_width, tibia_width)

    if ratio > 0.9:
        oa_grade = "KL-0"
        severity = "Normal"
    elif ratio > 0.75:
        oa_grade = "KL-1"
        severity = "Doubtful"
    elif ratio > 0.6:
        oa_grade = "KL-2"
        severity = "Mild"
    elif ratio > 0.45:
        oa_grade = "KL-3"
        severity = "Moderate"
    else:
        oa_grade = "KL-4"
        severity = "Severe"

    # Implant size lookup based on measured femur width
    if femur_width < 50:
        implant_size = "Small (Size 1-2)"
    elif femur_width < 90:
        implant_size = "Medium (Size 3-5)"
    else:
        implant_size = "Large (Size 6-8)"

    return {
        "femur_width_px": int(femur_width),
        "tibia_width_px": int(tibia_width),
        "oa_grade": oa_grade,
        "severity": severity,
        "implant_size": implant_size,
        "explanation": f"Detected femur width {int(femur_width)}px and tibia width {int(tibia_width)}px. "
                        f"Structural ratio indicates {severity} osteoarthritis ({oa_grade}). "
                        f"Recommended implant size range: {implant_size}."
    }


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    image_bytes = await file.read()
    result = analyze_image(image_bytes)
    return result