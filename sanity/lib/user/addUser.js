import { adminclient } from "../adminclient";

export async function addUser({ id, username, email, imageUrl }) {
  console.log(
    `adding user with the credentials ${username}  email>>${email} imageUrl >>${imageUrl}`
  );
  const user = await adminclient.createIfNotExists({
    _type: "user",
    _id: id,
    username,
    email,
    imageUrl,
  });

  return user;
}
