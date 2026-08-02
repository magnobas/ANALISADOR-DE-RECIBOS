<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1-C1xS-CZcyM73UoH0HdIOyL1JaumtBwg

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Transferência Óptica

O arquivo [`transferencia-optica.html`](transferencia-optica.html) é um app HTML independente (sem build, sem servidor) inspirado no [decimen-optical-transfer](https://github.com/bashalarmistalt/decimen-optical-transfer): transfere arquivos ou textos entre dois dispositivos usando apenas a tela e a câmera, sem rede.

Basta abrir o arquivo direto no navegador (ou hospedá-lo em qualquer servidor estático):
- **Enviar**: escolha um arquivo (ou cole um texto), e o app exibe uma sequência de QR codes em loop contendo os blocos do arquivo, com checksum SHA-256 e compressão gzip automática.
- **Receber**: aponte a câmera de outro dispositivo para a tela; o app decodifica os QR codes, remonta o arquivo e libera o download assim que todos os blocos forem capturados e o checksum for validado.
