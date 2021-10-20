import {Tab, Popover, OverlayTrigger, Button, Accordion} from "react-bootstrap";
import {ElementType} from "../../DataTypes";
import {useDispatch, useSelector} from "react-redux";
import {append as appendUserContent} from "../../../slices/userContentSlice";
import {update} from "../../../slices/qrCodeSlice";
import {UploadFile, GetImageMetadataAsync} from "../../../Helpers";
import QRCode from "qrcode.react"

// TODO: Convert to an API calls
import defaultGraphics from "../../../defaultGraphics.json"
import {removeByRefId, updateByRefId} from "../../../slices/elementsSlice";

export const GraphicsPane = ({dragElementRef}) => {
    return (
        <Tab.Pane eventKey="graphics">
            <Accordion flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Stock Images</Accordion.Header>
                    <Accordion.Body>
                        <StockContent dragElementRef={dragElementRef}/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>User Uploaded Images</Accordion.Header>
                    <Accordion.Body>
                        <UserContent dragElementRef={dragElementRef}/>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>QR Code</Accordion.Header>
                    <Accordion.Body>
                        <QuickResponseContent dragElementRef={dragElementRef}/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Tab.Pane>
    )
}

const StockContent = ({dragElementRef}) => {
    return <>
        {defaultGraphics.map((graphic) => (
            <img
                id={graphic.id}
                key={graphic.id}
                src={graphic.src}
                alt={graphic.alt}
                width={66}
                height={80}
                draggable={true}
                crossOrigin="anonymous"
                onDragStart={(e) => {
                    dragElementRef.current = {
                        refId: graphic.id,
                        width: e.target.width,
                        height: e.target.height,
                        src: e.target.src,
                        alt: graphic.alt,
                        type: ElementType.StockContent,
                        scaleX: .5,
                        scaleY: .5,
                        selected: false,
                        hasCollision: false
                    };
                }}
            />
        ))}
    </>
}

const UserContent = ({dragElementRef}) => {
    const dispatch = useDispatch();
    const userContent = useSelector((state) => state.userContent.value)

    const handleImageUpload = async (e) => {
        [...e.target.files].map(async (file, index) => {
            const options = {
                key: `usercontent/${file.name}`,
                bucket: "d2go-coldfusion-us-east-1"
            }

            const response = await UploadFile(file, options);

            if (response === 200) {
                const sourceUrl = `https://d2go-coldfusion-us-east-1.s3.amazonaws.com/usercontent/${file.name}`;
                const {width, height} = await GetImageMetadataAsync(sourceUrl);

                dispatch(appendUserContent({
                    id: userContent.length + index,
                    src: sourceUrl,
                    alt: file.name,
                    size: file.size,
                    width: width,
                    height: height
                }));
            } else {
                throw new Error(`Failed to upload file: ${file.name}`);
            }
        })

        document.getElementById('user-content-file-input').value = null;
    }

    return <>
        <input id='user-content-file-input' type="file" className='form-control' onChange={handleImageUpload} multiple/>
        <br/><br/>
        {userContent.map((graphic) => (
            <div key={graphic.id.toString()}>
                <img
                    id={graphic.id}
                    key={graphic.id}
                    src={graphic.src}
                    alt={graphic.alt}
                    draggable="true"
                    width={66}
                    height={80}
                    crossOrigin={"anonymous"}
                    onDragStart={(e) => {
                        dragElementRef.current = {
                            refId: graphic.id,
                            width: e.target.width / 3,
                            height: e.target.height / 3,
                            src: e.target.src,
                            alt: graphic.alt,
                            type: ElementType.UserContent,
                            scaleX: 1,
                            scaleY: 1,
                            size: graphic.size,
                            selected: false,
                            hasCollision: false
                        };
                    }}
                />
                {(graphic.size < 1024 || graphic.width < 100 || graphic.height < 100) &&
                <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={(
                        <Popover>
                            <Popover.Header as="h4">Image Quality Alert</Popover.Header>
                            <Popover.Body>
                                <h5>Current Logic:</h5>
                                <p>{'graphic.size < 1024 || graphic.width < 100 || graphic.height < 100'}</p>
                                Your image has low <b>resolution</b> and won't print well. Please replace it with an
                                image that has a
                                higher <b>resolution</b>.
                            </Popover.Body>
                        </Popover>
                    )}
                >
                    <Button variant="outline-danger">
                        <img
                            src='https://studio4client.cdn.vpsvc.com/images/6e4679fb3a8d5aac32538236149956157b5e4697/default/contextualmessage/icons/error-1x.png'
                            alt='Error!'
                        />
                    </Button>
                </OverlayTrigger>}
            </div>
        ))}
    </>
}

const QuickResponseContent = ({dragElementRef}) => {
    const dispatch = useDispatch();
    const qrCodeValue = useSelector((state) => state.qrCode.value)

    return <>
        <input placeholder='https://fyrefly.netlify.app/' type={"text"} onChange={async (e) => {
            await dispatch(update(e.target.value))
            const canvas = document.querySelector(".qrCodeCanvas canvas")
            if (e.target.value) dispatch(updateByRefId({
                refId: 1,
                src: canvas.toDataURL("image/jpeg", 1),
                type: ElementType.QRCode
            }));
            else dispatch(removeByRefId({refId: 1, type: ElementType.QRCode}));
        }}/>
        <div className="qrCodeCanvas">
            {qrCodeValue && <QRCode
                value={qrCodeValue}
                size={1000}
                onDragStart={(e) => {
                    dragElementRef.current = {
                        refId: 1,
                        width: 1000,
                        height: 1000,
                        src: e.target.toDataURL("image/jpeg", 1),
                        type: ElementType.QRCode,
                        scaleX: 0.1,
                        scaleY: 0.1,
                        selected: false
                    };
                }}
                style={{height: '86px', width: '86px;'}}
                draggable
            />}
        </div>
    </>
}