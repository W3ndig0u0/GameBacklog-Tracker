export const getImg = (id: string, sz: string) =>
  id ? `https://images.igdb.com/igdb/image/upload/t_${sz}/${id}.jpg` : "";