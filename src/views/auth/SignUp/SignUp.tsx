import SignUpForm from './SignUpForm'

const SignUp = () => {
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2>Créer un compte</h2>
            </div>
            <SignUpForm disableSubmit={false} />
        </>
    )
}

export default SignUp
