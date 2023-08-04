import React, { useEffect, useState } from 'react';
import axios from 'axios';

function VideoComponent() {

    useEffect(() => {
        axios.get(`http://localhost:8080/bytes/`).then((response) => {
            console.log(response);
            let x = response.data.toString('base64');
            console.log(x);

            document.getElementById('myvideo').src = x;

            // var blob = b64toBlob(response.data, "video/mp4");
            // var url = URL.createObjectURL(blob);
            // document.getElementById('myvideo').src = url;
        });
    });

    var b64toBlob = (b64Data, contentType, sliceSize) => {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    return (
        <div>
            <video id="myvideo" />
        </div>
    )
}

export default VideoComponent;