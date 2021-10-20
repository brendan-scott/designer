import {Element} from "../Element";
import {present as presentElements, select} from "../../slices/elementsSlice";
import React from "react";
import {useDispatch, useSelector} from "react-redux";

export const Elements = () => {
    const dispatch = useDispatch();
    const elements = useSelector(presentElements);

    return (
        <>
            {elements.map((element, index) => {
                return <Element
                    key={index}
                    element={element}
                    setSelectedElement={() => {
                        !element.locked && dispatch(select(element.id))
                    }}
                />;
            })}
        </>
    )
}