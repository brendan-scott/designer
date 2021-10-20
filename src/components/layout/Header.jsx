import {Container, Navbar, NavbarBrand, NavDropdown, NavLink} from "react-bootstrap";
import React from 'react'
import convert from 'convert-units'
import Konva from "konva";
import {switchTemplate} from "../../slices/templateSlice";
import {initializeByTemplate as initializeTextFieldsByTemplate} from "../../slices/textFieldsSlice";
import {useDispatch, useSelector} from "react-redux";
import {toggle} from "../../slices/layersSlice";
import {
    deselect,
    present as presentElements,
    initializeByTemplate as initializeElementsByTemplate
} from "../../slices/elementsSlice";
import {dataURItoBlob, UploadFile} from "../../Helpers";
import {v4 as uuidv4} from 'uuid';
import {jsPDF} from "jspdf";
import DefaultTemplates from "../../defaultTemplates.json";

export const Header = ({stageRef, layerRef, past, future, onUndo, onRedo}) => {
    const dispatch = useDispatch();
    const activeTemplate = useSelector((state) => state.template.value)
    const elements = useSelector(presentElements);
    const hasSelectedElement = elements.some((element) => element.selected);
    const toggleLayers = useSelector((state) => state.layers.value)
    const template = useSelector((state) => state.template.value);
    const hiddenCanvas = document.createElement('canvas'), hiddenCanvasContext = hiddenCanvas.getContext('2d');

    function trimCanvas() {
        let layerContext = layerRef.current.getCanvas()._canvas.getContext('2d'),
            pixels = layerContext.getImageData(0, 0, stageRef.current.getWidth(), stageRef.current.getHeight()),
            l = pixels.data.length,
            i,
            bound = {
                top: null,
                left: null,
                right: null,
                bottom: null
            },
            x, y;

        // Iterate over every pixel to find the highest and where it ends on every axis ()
        for (i = 0; i < l; i += 4) {
            if (pixels.data[i + 3] !== 0) {
                x = (i / 4) % stageRef.current.getWidth();
                y = ~~((i / 4) / stageRef.current.getWidth());

                if (bound.top === null) {
                    bound.top = y;
                }

                if (bound.left === null) {
                    bound.left = x;
                } else if (x < bound.left) {
                    bound.left = x;
                }

                if (bound.right === null) {
                    bound.right = x;
                } else if (bound.right < x) {
                    bound.right = x;
                }

                if (bound.bottom === null) {
                    bound.bottom = y;
                } else if (bound.bottom < y) {
                    bound.bottom = y;
                }
            }
        }

        // Calculate the height and width of the content
        const trimHeight = bound.bottom - bound.top, trimWidth = bound.right - bound.left,
            trimmed = layerContext.getImageData(bound.left, bound.top, trimWidth, trimHeight);

        hiddenCanvas.width = trimWidth;
        hiddenCanvas.height = trimHeight;
        hiddenCanvasContext.putImageData(trimmed, 0, 0);

        // Create a new hidden Konva stage to allow for scaling the finished export
        const stage = new Konva.Stage({
            container: 'hidden-stage',
            width: trimWidth,
            height: trimHeight
        });

        const layer = new Konva.Layer();
        stage.add(layer);

        layer.add(new Konva.Image({image: hiddenCanvas}));

        return stage.toDataURL({
            mimeType: "image/jpeg",
            quality: 1,
            pixelRatio: 25
        });
    }

    return <Navbar sticky="top" bg="light" variant="light">
        <Container>
            <NavbarBrand href='#'>
                <img
                    src='https://static.commerceplatform.services/content/img/firefly.png'
                    alt='fyrefly'
                    style={{width: 50, height: 50}}
                />
            </NavbarBrand>
            {
                elements.length > 0 && <NavLink onClick={() => {
                    dispatch(toggle())
                }}>{toggleLayers ? "Hide" : "Show"} Layers</NavLink>
            }
            {elements.length > 0 &&
            <NavDropdown
                title="Export Design"
                id="canvas-export-drop-down"
                onMouseOver={() => dispatch(deselect())}>
                <NavDropdown.Item
                    onClick={() => {
                        // Code form KonvaJS wiki
                        const pdf = new jsPDF(template.canvas.width < template.canvas.height ? 'portrait' : 'landscape', 'in', [convert(template.canvas.width).from(template.canvas.unitOfMeasure).to('in'), convert(template.canvas.height).from(template.canvas.unitOfMeasure).to('in')]);
                        pdf.setTextColor('#000000');

                        // // first add texts
                        // stageRef.current.find('Text').forEach((text) => {
                        //     const size = text.fontSize() / 0.75; // convert pixels to points
                        //     pdf.setFontSize(size);
                        //     pdf.text(text.attrs.text, text.attrs.x, text.attrs.y, {
                        //         baseline: 'top',
                        //         angle: -text.getAbsoluteRotation()
                        //     });
                        // });

                        // then put image on top of texts (so texts are not visible)
                        pdf.addImage(
                            stageRef.current.toDataURL({
                                mimeType: "image/jpeg",
                                quality: 1,
                                pixelRatio: 15
                            }),
                            0,
                            0,
                            pdf.internal.pageSize.getWidth(),
                            pdf.internal.pageSize.getHeight()
                        );

                        pdf.save('canvas.pdf');
                    }}
                >
                    To PDF
                </NavDropdown.Item>
                <NavDropdown.Item
                    onClick={() => {
                        // TODO: Convert into a preSigned image ypload, then download via preSigned download
                        let link = document.createElement('a');
                        link.download = 'canvas.jpeg';
                        link.href = trimCanvas();
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                >
                    To JPEG
                </NavDropdown.Item>
                <NavDropdown.Item
                    onClick={async () => {
                        if (hasSelectedElement) {
                            await dispatch(deselect());
                        }

                        console.log(JSON.stringify(JSON.parse(stageRef.current.toJSON()), null, 2))
                    }}
                >
                    To Console
                </NavDropdown.Item>
                <NavDropdown.Item
                    onClick={async (e) => {
                        e.preventDefault();

                        const fileName = uuidv4();

                        const options = {
                            key: `usercontent/shared/canvases/${fileName}`,
                            bucket: "d2go-coldfusion-us-east-1"
                        }

                        const response = await UploadFile(dataURItoBlob(trimCanvas()), options);

                        if (response === 200) {
                            window.location = `mailto:?body=Hello!%0D%0A%0D%0ACheck out my design custom design here:%0D%0A%0D%0Ahttps://d2go-coldfusion-us-east-1.s3.amazonaws.com/usercontent/shared/canvases/${fileName}%0D%0A%0D%0A%0D%0A%0D%0AThanks!&subject=Check out my custom design!`;
                        }
                    }}
                >
                    To Email
                </NavDropdown.Item>
            </NavDropdown>}
            <NavDropdown title="Choose template" id="template-drop-down">
                {DefaultTemplates.map((template, index) => {
                        return (
                            <React.Fragment key={template.id}>
                                <NavDropdown.Item
                                    onClick={() => {
                                        dispatch(switchTemplate(template.id));
                                        dispatch(initializeElementsByTemplate(template));
                                        dispatch(initializeTextFieldsByTemplate(template));
                                    }}
                                    disabled={activeTemplate.id === template.id}
                                >
                                    {template.id}: {template.name}
                                </NavDropdown.Item>
                                {index !== DefaultTemplates.length - 1 && <NavDropdown.Divider/>}
                            </React.Fragment>
                        )
                    }
                )}
            </NavDropdown>
            <NavLink disabled={past.length <= 0} onClick={onUndo}>
                Undo
            </NavLink>
            <NavLink disabled={future.length <= 0} onClick={onRedo}>
                Redo
            </NavLink>
        </Container>
    </Navbar>
}