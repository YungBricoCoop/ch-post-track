import { sha256 } from 'js-sha256';


const hashSha256 =(str)  => {
  return sha256(str);
}

export { hashSha256 };