import classNames from 'classnames'

const action = ["modifier", "voir", "supprimer"]
const color = ["orange", "purple", "red"]
const opacity = ["100", "200", "300", "400", "500", "600", "700", "800"]
const handleClick = ["edit", "show", "delete"]

const ActionButton(props) => {
    const {
        action,
        className,
    } = props

    return (
        <actionButton
            className="text-{color}-{opacity} hover:text-{color}-{opacity} font-semibold text-sm transition-colors"
            onClick={() => open{handleClick}Dialog(ticket)}
        >
                            {action}
        </actionButton>
    )
}

export default ActionButton

