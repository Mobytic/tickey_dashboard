import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h3>Créer un compte</h3>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
