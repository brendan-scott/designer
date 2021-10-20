import {DropdownButton, FormControl, InputGroup, Dropdown} from "react-bootstrap";
import React from "react";
import convert from 'convert-units'
import {useDispatch, useSelector} from "react-redux";
import {updateCanvas} from "../../slices/templateSlice";
import 'bootstrap/dist/css/bootstrap.min.css'

export const CanvasDimensions = () => {
    const dispatch = useDispatch();
    const template = useSelector((state) => state.template.value);
    const unitOfMeasures = ['in', 'ft', 'yd', 'mm', 'cm', 'm'];
    const unitOfMeasure = convert().describe(template.canvas.unitOfMeasure);

    function updateCanvasDimensions(key, value) {
        dispatch(updateCanvas({
            keyValuePairs: [{
                key: key,
                value: value
            }]
        }))
    }

    return (
        <>
            <InputGroup size="sm">
                <InputGroup.Text>Width</InputGroup.Text>
                <FormControl className='form-control form-control-small'
                             aria-label="Width"
                             aria-describedby="inputGroup-sizing-sm"
                             value={template.canvas.width}
                             onChange={(e) => updateCanvasDimensions('width', e.target.value ? Number(e.target.value) : e.target.value)}
                />
                <InputGroup.Text>Height</InputGroup.Text>
                <FormControl className='form-control form-control-small'
                             aria-label="Height"
                             aria-describedby="inputGroup-sizing-sm"
                             value={template.canvas.height}
                             onChange={(e) => updateCanvasDimensions('height', e.target.value ? Number(e.target.value) : e.target.value)}
                />
                <InputGroup.Text>Unit Of Measure</InputGroup.Text>
                <DropdownButton
                    variant="outline-secondary"
                    title={unitOfMeasure.plural}
                >
                    {unitOfMeasures.map((uom, index) => {
                        const uomDescription = convert().describe(uom);
                        return <React.Fragment key={index}>
                            <Dropdown.Item
                                disabled={template.canvas.unitOfMeasure === uom}
                                onClick={() => dispatch(updateCanvas({
                                    keyValuePairs: [{
                                        key: 'unitOfMeasure',
                                        value: uom
                                    }, {
                                        key: 'width',
                                        value: convert(template.canvas.width).from(template.canvas.unitOfMeasure).to(uom)
                                    }, {
                                        key: 'height',
                                        value: convert(template.canvas.height).from(template.canvas.unitOfMeasure).to(uom)
                                    }]
                                }))}
                            >
                                {uomDescription.abbr} ({uomDescription.system})
                            </Dropdown.Item>
                            {index !== unitOfMeasures.length - 1 && <Dropdown.Divider/>}
                        </React.Fragment>
                    })}
                </DropdownButton>
            </InputGroup>
        </>
    )
}