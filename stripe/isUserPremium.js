import { getIdToken, getIdTokenResult } from "firebase/auth";
import { auth } from "../config/firebase";

export default async function isUserPremium() {
  const currentUser = auth.currentUser;

  if (currentUser) {
    await getIdToken(currentUser, true);
    const decodedToken = await getIdTokenResult(currentUser);
    console.log("The decoded token is: ", decodedToken)
    return decodedToken.claims.stripeRole ? true : false;
  }

  return false;
}
