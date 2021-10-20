import axios from "axios";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";

export async function UploadFile(file, options) {
    const preSignedPutResponse = await axios.get(`?k=${options.key}&b=${options.bucket}&m=putObject`, {
        method: 'get',
        baseURL: 'https://oyvho496xc.execute-api.us-east-1.amazonaws.com/stage/image',
        headers: {
            'Accept': 'application/json',
        }
    });

    if (preSignedPutResponse.status === 200) {
        const putResponse = await axios.put(JSON.parse(preSignedPutResponse.data.body).url, file, {
            headers: {
                'Content-Type': file.type
            }
        })
        return putResponse.status;
    }
    return preSignedPutResponse.status;
}

export async function GetFile(options) {
    const preSignedPutResponse = await axios.get(`?k=${options.key}&b=${options.bucket}&m=getObject`, {
        method: 'get',
        baseURL: 'https://oyvho496xc.execute-api.us-east-1.amazonaws.com/stage/image',
        headers: {
            'Accept': 'application/json',
        }
    });

    if (preSignedPutResponse.status === 200) {
        return JSON.parse(preSignedPutResponse.data.body).url;
    }

    return preSignedPutResponse.status;
}

export const DrawPolygon = (ctx, pts, radius) => {
    if (radius > 0) {
        pts = getRoundedPoints(pts, radius);
    }
    let i, pt, len = pts.length;
    for (i = 0; i < len; i++) {
        pt = pts[i];
        if (i === 0) {
            ctx.beginPath();
            ctx.moveTo(pt[0], pt[1]);
        } else {
            ctx.lineTo(pt[0], pt[1]);
        }
        if (radius > 0) {
            ctx.quadraticCurveTo(pt[2], pt[3], pt[4], pt[5]);
        }
    }
    ctx.closePath();
};

const getRoundedPoint = function (x1, y1, x2, y2, radius, first) {
    const total = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)),
        idx = first ? radius / total : (total - radius) / total;
    return [x1 + (idx * (x2 - x1)), y1 + (idx * (y2 - y1))];
};

const getRoundedPoints = function (pts, radius) {
    let i1, i2, i3, p1, p2, p3, prevPt, nextPt,
        len = pts.length,
        res = new Array(len);
    for (i2 = 0; i2 < len; i2++) {
        i1 = i2 - 1;
        i3 = i2 + 1;
        if (i1 < 0) {
            i1 = len - 1;
        }
        if (i3 === len) {
            i3 = 0;
        }
        p1 = pts[i1];
        p2 = pts[i2];
        p3 = pts[i3];
        prevPt = getRoundedPoint(p1[0], p1[1], p2[0], p2[1], radius, false);
        nextPt = getRoundedPoint(p2[0], p2[1], p3[0], p3[1], radius, true);
        res[i2] = [prevPt[0], prevPt[1], p2[0], p2[1], nextPt[0], nextPt[1]];
    }
    return res;
};

export const StringEqualsIgnoreCase = (str1, str2) => {
    return str1.toUpperCase() === str2.toUpperCase();
}

export const GetImageMetadataAsync = (url) => new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
        resolve(img);
    };

    img.onError = (event) => {
        reject(`${event.type}: ${event.message}`);
    };

    img.src = url;
});

export const haveCollision = (r1, r2) => {
    return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height ||
        r2.y + r2.height < r1.y
    );
}

export function useWindowSize() {
    const template = useSelector((state) => state.template.value);

    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined,
    });

    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    const canvasWidth = windowSize.width * .5;
    const canvasHeight = windowSize.height * .5;
    const canvasRatio = canvasWidth / canvasHeight;

    const ratio = template.canvas.width / template.canvas.height;
    let maxX, minX, middleX;
    let minY = canvasHeight * .01;
    let maxY = canvasHeight * .99;

    if (template.canvas.width === template.canvas.height) {
        middleX = ((canvasWidth / 2) - canvasHeight / 2) | 0;
        minX = (canvasHeight * .01) + middleX;
        maxX = (canvasHeight * .99) + middleX;
    } else {
        middleX = ((canvasWidth / 2) - (canvasHeight * ratio) / 2) | 0;

        if (template.canvas.width > template.canvas.height) {
            minX = (((canvasHeight * .01) * ratio) + middleX) | 0;
            maxX = (((canvasHeight * .99) * ratio) + middleX) | 0;
        } else {
            minX = (((canvasHeight * .01) * ratio) + middleX) | 0;
            maxX = (((canvasHeight * .99) * ratio) + middleX) | 0;
        }

        // Scale the image to fit within the canvas, while maintaining aspect ratio
        let imageWidth = maxX - minX;
        let imageHeight = maxY - minY;
        let imageRatio = imageWidth / imageHeight;

        const dimensions = canvasRatio > imageRatio ? {
            width: imageWidth * canvasHeight / imageHeight,
            height: canvasHeight,
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight
        } : {
            width: canvasWidth,
            height: imageHeight * canvasWidth / imageWidth,
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight
        };

        minX = Math.max((canvasWidth - dimensions.width) / 2, 10);
        maxX = canvasWidth - ((canvasWidth - dimensions.width) / 2);
        minY = (canvasHeight - dimensions.height) / 2;
        maxY = canvasHeight - ((canvasHeight - dimensions.height) / 2);
    }

    return {
        ...windowSize,
        canvasDimensions: {
            width: canvasWidth,
            height: canvasHeight,
            ratio: canvasRatio
        },
        clipDimensions: {
            x: [minX, maxX],
            y: [minY, maxY],
            width: (maxX - minX) | 0,
            height: (maxY - minY) | 0,
            ratio: ((maxX - minX) | 0) / ((maxY - minY) | 0)
        }
    };
}

export function dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for(let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}