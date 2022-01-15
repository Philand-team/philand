
// SPDX-License-Identifier: GPL-2.0-or-later

pragma solidity ^0.8.4;

import { Base64 } from "./Base64.sol";
library SVGcard {
    function generateSVG(string memory color1,string memory subdomainName) internal pure returns (string memory svg) {
        return
            string(
                abi.encodePacked(
                    generateSVGDefs("ecfdcc",color1),
                    generateSVGBorderText(
                        subdomainName
                      )
            )
            );
    }

    function generateSVGDefs(string memory color0,string memory color1) internal pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<svg width="500" height="290" viewBox="0 0 500 290" xmlns="http://www.w3.org/2000/svg"',
                " xmlns:xlink='http://www.w3.org/1999/xlink'>",
                '<defs>',
                '<filter id="f1"><feImage result="p0" xlink:href="data:image/svg+xml;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            "<svg width='500' height='290' viewBox='0 0 500 290' xmlns='http://www.w3.org/2000/svg'><rect width='500px' height='290px' fill='#",
                            color0,
                            "'/></svg>"
                        )
                    )
                ),
                '"/><feImage result="p1" xlink:href="data:image/svg+xml;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            "<svg width='500' height='290' viewBox='0 0 500 290' xmlns='http://www.w3.org/2000/svg'><circle cx='",
                            "0",
                            "' cy='",
                            "100",
                            "' r='120px' fill='#",
                            color1,
                            "'/></svg>"
                        )
                    )
                ),
                '"/><feImage result="p2" xlink:href="data:image/svg+xml;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            "<svg width='500' height='290' viewBox='0 0 500 290' xmlns='http://www.w3.org/2000/svg'><circle cx='",
                            "100",
                            "' cy='",
                            "100",
                            "' r='120px' fill='#",
                            color0,
                            "'/></svg>"
                        )
                    )
                ),
                '" />',
                '<feImage result="p3" xlink:href="data:image/svg+xml;base64,',
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            "<svg width='500' height='290' viewBox='0 0 500 290' xmlns='http://www.w3.org/2000/svg'><circle cx='",
                            "100",
                            "' cy='",
                            "200",
                            "' r='100px' fill='#",
                            color1,
                            "'/></svg>"
                        )
                    )
                ),
                '" /><feBlend mode="overlay" in="p0" in2="p1" /><feBlend mode="exclusion" in2="p2" /><feBlend mode="overlay" in2="p3" result="blendOut" /><feGaussianBlur ',
                'in="blendOut" stdDeviation="42" /></filter> <clipPath id="corners"><rect width="500" height="290" rx="42" ry="42" /></clipPath>',
                '<path id="text-path-a" d="M455 1H34L14 12L1 34V245L14 258L34 270H460L474 258L485 245V34L474 12L455 1Z" />',
                '<filter id="top-region-blur"><feGaussianBlur in="SourceGraphic" stdDeviation="24" /></filter>',
                '</defs>',
                '<g clip-path="url(#corners)">',
                '<rect fill="',
                color0,
                '" x="0px" y="0px" width="500px" height="290px" />',
                '<rect style="filter: url(#f1)" x="0px" y="0px" width="500px" height="290px" />',
                ' <g style="filter:url(#top-region-blur); transform:scale(1.5); transform-origin:center top;">',
                '<rect fill="none" x="0px" y="0px" width="500px" height="290px" />',
                '<ellipse cx="50%" cy="0px" rx="180px" ry="120px" fill="#000" opacity="0.85" /></g>',
                '</g>'
            )
        );
        return svg;
    }

        function generateSVGBorderText(
        string memory subdomainName
        ) internal pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<text text-rendering="optimizeSpeed">',
                '<textPath startOffset="-100%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
                subdomainName,
                ' <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" />',
                '</textPath> <textPath startOffset="0%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
                subdomainName,
                ' <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" /> </textPath>',
                '<textPath startOffset="50%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
                "NFTHack2022/philand",
                ' <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s"',
                ' repeatCount="indefinite" /></textPath><textPath startOffset="-50%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
                "NFTHack2022/philand",
                ' <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" /></textPath></text>'
            )
        );
        return svg;
     }
}