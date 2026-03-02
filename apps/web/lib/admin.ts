import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const ADMIN_UID = "RFXkA9U7PeW6NkVYfFonufwq2Eg1";

export function watchAdmin(onOk: () => void, onNo: () => void) {
  return onAuthStateChanged(auth, (user) => {
    if (user?.uid && user.uid === ADMIN_UID) onOk();
    else onNo();
  });
}
