import axios from "axios";

export const decodeToken = async (token) => {
  try {
    const res = await axios.get(
      `https://sae-backend-n9d3.onrender.com/jwt/decode`,
      {
        headers: {
            Authorization: `Bearer ${token}`,
        },
      }
    );
    if (res.status === 200) {
      console.log(res.data.data);
      return res.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};