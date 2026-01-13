
export const ImageUploadHandler = {
  handleImageUpload: (onImageSelected: (base64Image: string) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Image = e.target?.result as string;
          onImageSelected(base64Image);
        };
        reader.readAsDataURL(file);
      }
    };
    
    input.click();
  },
};