import {ChromePicker} from "react-color";
import {Accordion, Tab} from "react-bootstrap";
import {updateBase} from "../../../slices/templateSlice";
import {useDispatch, useSelector} from "react-redux";

export const OptionsPane = () => {
    const dispatch = useDispatch();
    const template = useSelector((state) => state.template.value);

    return (
        <Tab.Pane eventKey="options">
            <Accordion flush>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Background Color</Accordion.Header>
                    <Accordion.Body>
                        <ChromePicker
                            color={template.base.color}
                            onChange={(color) => dispatch(updateBase({
                                keyValuePairs: [{
                                    key: 'color',
                                    value: color.hex
                                }]
                            }))}
                            disableAlpha={true}/>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Tab.Pane>
    )
}