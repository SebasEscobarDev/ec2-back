const API = 'http://localhost:5000/compatibility';

export const postReShScore = async (item, files) => {
  try {
    const response = await fetch(`${API}/relationship_score`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(item),
      files: files
    })
    return response
  } catch (e) {
    console.log(e)
  }
}