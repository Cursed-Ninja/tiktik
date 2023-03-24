import axios from "axios";
import jwtDecode from "jwt-decode";

export const base_url = process.env.NEXT_PUBLIC_BASE_URL;

export const createOrGetUser = async (res: any, addUser: any) => {
  const decoded: { name: String; picture: String; sub: String } = jwtDecode(
    res.credential
  );
  const { name, picture, sub } = decoded;
  const user = {
    _id: sub,
    _type: "user",
    userName: name,
    image: picture,
  };
  addUser(user);
  await axios.post(`${base_url}/api/auth`, user);
};
