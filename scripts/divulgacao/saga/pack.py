"""Bundle the ordered PNGs and posting text; verify byte-for-byte contents."""
from pathlib import Path
import zipfile

folder = Path("docs/divulgacao/saga-escavacao")
images = sorted((folder / "imagens").glob("*.png"))
assert len(images) == 12
output = folder / "carrossel-viveiro-12-imagens.zip"
with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_DEFLATED) as archive:
    for image in images:
        archive.write(image, image.name)
    for name in ["legenda.txt", "texto-alternativo.txt"]:
        archive.write(folder / name, name)
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    for image in images:
        assert archive.read(image.name) == image.read_bytes()
print(output.resolve())
