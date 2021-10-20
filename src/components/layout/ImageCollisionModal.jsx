import {Button, Modal} from "react-bootstrap";
import React from "react";
import {append, present as presentElements, replaceById, updateById} from "../../slices/elementsSlice";
import {useDispatch, useSelector} from "react-redux";
import {toggle} from "../../slices/collisionModalSlice";

export const ImageCollisionModal = ({stageRef, dragElementRef}) => {
    const dispatch = useDispatch();
    const showCollisionModal = useSelector((state) => state.collisionModal.value);
    const elements = useSelector(presentElements);

    return (
        <>
            <Modal
                show={showCollisionModal}
                onHide={() => dispatch(toggle())}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                draggable
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        Image Placement Options
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Would you like to add this image to your design or replace the background image?
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='outline-info' onClick={() => {
                        dispatch(append({
                            ...stageRef.current.getPointerPosition(), ...dragElementRef.current,
                            id: elements.length
                        }))
                        elements
                            .filter((element) => element.hasCollision)
                            .forEach((element) => {
                                dispatch(updateById({
                                    id: Number(element.id),
                                    keyValuePairs: [{
                                        key: 'hasCollision',
                                        value: false
                                    }]
                                }))
                            })
                        dispatch(toggle());
                    }}>Add image</Button>
                    <Button variant='outline-success' onClick={() => {
                        elements
                            .filter((element) => element.hasCollision)
                            .forEach((element, index) => {
                                if (index === 0) {
                                    dispatch(replaceById({
                                        id: Number(element.id),
                                        target: {
                                            ...stageRef.current.getPointerPosition(),
                                            ...dragElementRef.current,
                                            id: Number(element.id),
                                            locked: false,
                                            hidden: false
                                        }
                                    }))
                                } else {
                                    dispatch(updateById({
                                        id: Number(element.id),
                                        keyValuePairs: [{
                                            key: 'hasCollision',
                                            value: false
                                        }]
                                    }))
                                }
                            })
                        dispatch(toggle());
                    }}>Replace image</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}