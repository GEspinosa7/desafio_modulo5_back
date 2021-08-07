const supabase = require('../supabase');

const uploadImagem = async (nome, imagem, restaurante) => {
  const buffer = Buffer.from(imagem, 'base64');

  const data = { errorUpload: '', imagem_url: '' };
  try {
    const { error } = await supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .upload(`${restaurante}/${nome}`, buffer);

    if (error) {
      data.errorUpload = error.message;
      return data;
    }

    const { publicURL, error: errorPublicUrl } = supabase
      .storage
      .from(process.env.SUPABASE_BUCKET)
      .getPublicUrl(nome);

    if (errorPublicUrl) {
      data.errorUpload = errorPublicUrl.message;
      return data;
    }

    data.imagem_url = publicURL;

    return data;
  } catch (error) {
    return data.errorUpload = error.message;
  }

}

module.exports = uploadImagem;