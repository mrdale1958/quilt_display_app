export default function getBlockImage  (blockNum)  {
    const blockLibrary = process.env.REACT_APP_BLOCK_SRC;
    const blockImageName = String(blockNum).padStart(5, '0') + "_files/0/0_0.jpeg";
    return blockLibrary + blockImageName;
  }
