/**
 * Dispatches a WhatsApp kit (image + personalized message + links) in a single unified action.
 * Leverages native Web Share API with file attachments when available,
 * and seamlessly falls back to direct WhatsApp link + clipboard + auto-image download on desktop.
 */

export interface DispatchResult {
  success: boolean;
  method: 'web_share' | 'whatsapp_link_with_clipboard';
  message: string;
}

export async function dispatchKitInOneAction(options: {
  imageSrc: string;
  imageTitle: string;
  messageText: string;
  clientPhone: string;
  clientName: string;
  kitId: string;
}): Promise<DispatchResult> {
  const { imageSrc, imageTitle, messageText, clientPhone, kitId } = options;

  // Clean and normalize Spanish phone number (+34)
  const cleanPhone = clientPhone.replace(/\D/g, '');
  const targetPhone = cleanPhone.startsWith('34') ? cleanPhone : `34${cleanPhone || '600000000'}`;

  try {
    // 1. Fetch image blob
    const response = await fetch(imageSrc);
    if (!response.ok) {
      throw new Error(`No se pudo cargar la imagen: ${imageSrc}`);
    }
    const blob = await response.blob();
    const extension = blob.type.includes('png') ? 'png' : 'jpg';
    const fileName = `instacredit_${kitId}_${Date.now()}.${extension}`;
    const imageFile = new File([blob], fileName, { type: blob.type || 'image/jpeg' });

    // 2. Try native Web Share API with file support (Android, iOS, iPadOS, macOS, Windows supported)
    if (
      typeof navigator !== 'undefined' &&
      navigator.canShare &&
      navigator.canShare({ files: [imageFile] })
    ) {
      try {
        await navigator.share({
          files: [imageFile],
          title: imageTitle,
          text: messageText
        });

        return {
          success: true,
          method: 'web_share',
          message: '¡Kit completo enviado en 1 sola acción! Imagen y texto adjuntados directamente en WhatsApp.'
        };
      } catch (shareErr: unknown) {
        // If user cancelled the share dialog or browser errored, proceed to fallback
        if (shareErr instanceof Error && shareErr.name === 'AbortError') {
          return {
            success: false,
            method: 'web_share',
            message: 'Envío cancelado por el usuario.'
          };
        }
        console.warn('Web Share no completado, activando enlace directo WhatsApp con copia:', shareErr);
      }
    }

    // 3. Fallback: Unified Dual Execution for Desktop / Browsers without Web Share files
    // A. Copy text to clipboard
    try {
      await navigator.clipboard.writeText(messageText);
    } catch {
      // Fallback text copy if clipboard is blocked
      const textArea = document.createElement('textarea');
      textArea.value = messageText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }

    // B. Copy image to clipboard if supported by browser
    try {
      if (typeof ClipboardItem !== 'undefined' && navigator.clipboard && navigator.clipboard.write) {
        // Some browsers only support image/png in clipboard
        if (blob.type === 'image/png') {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
        }
      }
    } catch {
      // Image clipboard might require user gesture or png conversion, silent continue
    }

    // C. Trigger download of the image file so it is ready right in the downloads tray / drag & drop
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(downloadUrl), 5000);

    // D. Open WhatsApp with prefilled message in a single motion
    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');

    return {
      success: true,
      method: 'whatsapp_link_with_clipboard',
      message: '¡Kit preparado en 1 acción! WhatsApp abierto con el mensaje listo y la imagen descargada para adjuntar.'
    };
  } catch (error: unknown) {
    console.error('Error al despachar el kit:', error);
    // Ultimate basic fallback: just open WhatsApp link
    const encodedText = encodeURIComponent(messageText);
    window.open(`https://wa.me/${targetPhone}?text=${encodedText}`, '_blank');
    return {
      success: true,
      method: 'whatsapp_link_with_clipboard',
      message: 'Enlace de WhatsApp abierto con el mensaje prellenado.'
    };
  }
}
