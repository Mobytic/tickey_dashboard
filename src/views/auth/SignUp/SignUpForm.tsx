import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'
import PasswordInput from '@/components/shared/PasswordInput'
import ActionLink from '@/components/shared/ActionLink'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    signInUrl?: string
}

type SignUpFormSchema = {
    firstname: string
    lastname: string
    companyName: string
    password: string
    mail: string
}

const validationSchema = Yup.object().shape({
    firstname: Yup.string().required('Veuillez renseigner un prénom'),
    lastname: Yup.string().required('Veuillez renseigner un nom'),
    companyName: Yup.string().required("Veuillez renseigner l'entreprise"),
    mail: Yup.string()
        .email('Format de mail invalide')
        .required('Merci de renseigner un mail'),
    password: Yup.string().required('Veuillez renseigner le mot de passe'),
    confirmPassword: Yup.string().oneOf(
        [Yup.ref('password')],
        'Les mot de passe ne sont pas identiques'
    ),
})

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, signInUrl = '/sign-in' } = props

    const { signUp } = useAuth()

    const [message, setMessage] = useTimeOutMessage()

    const onSignUp = async (
        values: SignUpFormSchema,
        setSubmitting: (isSubmitting: boolean) => void
    ) => {
        const { firstname, lastname, companyName, password, mail } = values
        setSubmitting(true)
        const result = await signUp({ firstname, lastname, companyName, password, mail })

        if (result?.status === 'failed') {
            setMessage(result.message)
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            {message && (
                <Alert showIcon className="mb-4" type="danger">
                    {message}
                </Alert>
            )}
            <Formik
                initialValues={{
                    firstname: '',
                    lastname: '',
                    companyName: '',
                    password: '123Qwe1',
                    confirmPassword: '123Qwe1',
                    mail: 'test@testmail.com',
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    if (!disableSubmit) {
                        onSignUp(values, setSubmitting)
                    } else {
                        setSubmitting(false)
                    }
                }}
            >
                {({ touched, errors, isSubmitting }) => (
                    <Form>
                        <FormContainer>
                            <FormItem
                                label="Prénom"
                                invalid={errors.firstname && touched.firstname}
                                errorMessage={errors.firstname}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="firstname"
                                    placeholder="Prénom"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Nom"
                                invalid={errors.lastname && touched.lastname}
                                errorMessage={errors.lastname}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="lastname"
                                    placeholder="Nom"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Entreprise"
                                invalid={errors.companyName && touched.companyName}
                                errorMessage={errors.companyName}
                            >
                                <Field
                                    type="text"
                                    autoComplete="off"
                                    name="companyName"
                                    placeholder="Entreprise"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Email"
                                invalid={errors.mail && touched.mail}
                                errorMessage={errors.mail}
                            >
                                <Field
                                    type="email"
                                    autoComplete="off"
                                    name="mail"
                                    placeholder="Email"
                                    component={Input}
                                />
                            </FormItem>
                            <FormItem
                                label="Mot de passe"
                                invalid={errors.password && touched.password}
                                errorMessage={errors.password}
                            >
                                <Field
                                    autoComplete="off"
                                    name="password"
                                    placeholder="Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <FormItem
                                label="Confirmation de mot de passe"
                                invalid={
                                    errors.confirmPassword &&
                                    touched.confirmPassword
                                }
                                errorMessage={errors.confirmPassword}
                            >
                                <Field
                                    autoComplete="off"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    component={PasswordInput}
                                />
                            </FormItem>
                            <Button
                                block
                                loading={isSubmitting}
                                variant="solid"
                                type="submit"
                            >
                                {isSubmitting
                                    ? 'Creating Account...'
                                    : 'Créer un compte'}
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm
