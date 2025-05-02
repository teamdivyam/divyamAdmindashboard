const getFileNameFromImgURL = (imgURl) => {
    if (!imgURl) return;
    const splitARR = imgURl.split('/');
    const length = splitARR.length;
    return splitARR[length - 1];
}

export default getFileNameFromImgURL