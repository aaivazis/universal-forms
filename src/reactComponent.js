// third party imports
import React from 'react'

class UniversalForm extends React.Component {


    static propTypes = {
        resultAsString: React.PropTypes.bool,
        method: React.PropTypes.string,
        submitText: React.PropTypes.string,
    }


    static defaultProps = {
        submitText: 'submit',
        resultAsString: false,
        method: 'post',
    }


    constructor(props, ...args) {
        // instantiate this
        super(props, ...args)
        // set the initial state
        this.state = {
            // create a new form object with the intial data set
            form: new props.form(props.initialData),
        }
        // bind various functions
        this.focus = this.focus.bind(this)
        this.submitForm = this.submitForm.bind(this)
    }


    // called when the component is first mounted
    componentDidMount() {}


    // called before the component is removed from the dom
    componentWillUnmount() {}


    // focus the first input
    focus() {
        console.log('you want to focus on the form')
    }


    getElementForWidget({type = 'input', ...unusedProps}) {
        if (type === 'input') {
            return <input {...unusedProps}/>
        } else if (type === 'textarea') {
            return <textarea {...unusedProps}/>
        } else if (type === 'password') {
            return <input type='password' {...unusedProps}/>
        }
    }


    get formData() {
        // the object containing the form data
        const formData = {}
        // go over all of the fields in the form
        for (const {name} of this.state.form.fields) {
            // add the input value to the object
            formData[name] = this.refs[name].value
        }
        // return the data object
        return formData
    }


    get submitButton() {
        // grab the used props
        const {onSubmit, submitButtonStyle, submitText, submitButton} = this.props
        // if a custom submit button was return
        if (submitButton) {
            // use it instead
            return submitButton
        }

        // if there is an onClick handler
        if (onSubmit) {
            return (
                <span style={{...styles.submitButton, ...submitButtonStyle}} onClick={this.submitForm}>
                    {submitText}
                </span>
            )
        // otherwise use a native button
        }
        return (
            <input style={{...styles.submitButton, ...submitButtonStyle}} type='submit' value={submitText}/>
        )
    }


    // submit the form using the provided handler
    submitForm() {
        // get the submit handler from the component props
        const {onSubmit, resultAsString} = this.props
        // stringify the form data if the form was configured to do so
        const formData = resultAsString ? JSON.stringify(this.formData) : this.formData
        // call the handler with the serialized data
        onSubmit(formData)
    }


    // render the component
    render() {
        // grab the used properties
        const {
            labelStyle,
            inputStyle,
            fieldStyle,
            submitContainerStyle,
            ...unusedProps,
            action,
            method,
        } = this.props

        // render the component
        return (
            <form {...unusedProps} ref='form' action={action} method={method}>
                {this.state.form.fields.map(({name, label, widget}) => {
                    // the input widget
                    const inputWidget = React.cloneElement(this.getElementForWidget(widget), {
                        id: name,
                        ref: name,
                        style: inputStyle,
                    })
                    // render the form line
                    return (
                        <div style={fieldStyle} key={name}>
                            <label htmlFor={name} style={labelStyle}>{label}:</label>
                            {inputWidget}
                        </div>
                    )
                })}
                <div style={{...styles.submitContainer, ...submitContainerStyle}}>
                    {this.submitButton}
                </div>
            </form>
        )
    }
}

const styles = {
    submitContainer: {
        textAlign: 'right',
        marginTop: 30,
    },
    submitButton: {
        backgroundColor: '#2F5EBC',
        padding: 20,
        width: 150,
        display: 'inline-block',
        textAlign: 'center',
        color: 'white',
        cursor: 'pointer',
        textTransform: 'capitalize',
        border: 'none',
    },
}

export default UniversalForm


// end of file
