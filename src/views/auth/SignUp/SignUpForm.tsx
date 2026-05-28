import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import PasswordInput from '@/components/shared/PasswordInput'
import { Field, FieldArray, Form, Formik, FormikState, getIn } from 'formik'
import * as Yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'
import type { CommonProps } from '@/@types/common'
import { Notification, toast } from '@/components/ui'
import { apiAuthUpdate } from '@/services/authService'

interface SignUpFormProps extends CommonProps {
    disableSubmit?: boolean
    initialData?: any
    onSuccess?: () => void
}

const createValidationSchema = Yup.object().shape({
    firstname: Yup.string().required('Veuillez renseigner un prénom'),
    lastname: Yup.string().required('Veuillez renseigner un nom'),
    companyName: Yup.string().required("Veuillez renseigner l'entreprise"),
    mail: Yup.string().email('Format de mail invalide').required('Merci de renseigner un mail'),
    password: Yup.string().required('Veuillez renseigner le mot de passe'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Les mots de passe ne sont pas identiques'),
})

const updateValidationSchema = Yup.object().shape({
    firstname: Yup.string().required('Veuillez renseigner un prénom'),
    lastname: Yup.string().required('Veuillez renseigner un nom'),
    companyName: Yup.string().required("Veuillez renseigner l'entreprise"),
    mail: Yup.string().email('Format de mail invalide').required('Merci de renseigner un mail'),
})

const SignUpForm = (props: SignUpFormProps) => {
    const { disableSubmit = false, className, initialData, onSuccess } = props

    const { signUp } = useAuth()

    const isEditMode = Boolean(initialData)

    const onFormSubmit = async (
        values: any,
        setSubmitting: (isSubmitting: boolean) => void,
        resetForm: (nextState?: Partial<FormikState<any>>) => void
    ) => {
        setSubmitting(true)
        
        try {
            if (isEditMode) {
                await apiAuthUpdate(initialData!.id, {
                    firstname: values.firstname,
                    lastname: values.lastname,
                    companyName: values.companyName,
                    mail: values.mail,
                    urls: values.urls,
                })
                toast.push(<Notification type="success" duration={3000}>Utilisateur mis à jour !</Notification>, { placement: 'top-end' })
                if (onSuccess) onSuccess()
                
            } else {
                const result = await signUp({ 
                    firstname: values.firstname, 
                    lastname: values.lastname, 
                    companyName: values.companyName, 
                    password: values.password, 
                    mail: values.mail, 
                    passwordConfirmation: values.confirmPassword,
                     urls: values.urls,
                })
                
                if (result?.status === 'failed') {
                    toast.push(<Notification type="warning" duration={3000}>{result?.message}</Notification>, { placement: 'top-end' })
                } else if(result?.status === 'success'){
                    toast.push(<Notification type="success" duration={3000}>{result?.message}</Notification>, { placement: 'top-end' })
                    resetForm()
                    if (onSuccess) onSuccess()
                }
            }
        } catch (error) {
            console.error(error)
            toast.push(<Notification type="danger" duration={3000}>Une erreur est survenue.</Notification>, { placement: 'top-end' })
        }

        setSubmitting(false)
    }

    return (
        <div className={className}>
            <Formik
                initialValues={{
                    firstname: initialData?.firstname || '',
                    lastname: initialData?.lastname || '',
                    companyName: initialData?.companyName || '',
                    mail: initialData?.mail || '',
                    password: '', 
                    confirmPassword: '',
                    urls: initialData?.websites || [],
                }}
                validationSchema={isEditMode ? updateValidationSchema : createValidationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                    if (!disableSubmit) {
                        onFormSubmit(values, setSubmitting, resetForm)
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
                                invalid={Boolean(errors.firstname && touched.firstname)}
                                errorMessage={errors.firstname as string}
                            >
                                <Field type="text" autoComplete="off" name="firstname" placeholder="Prénom" component={Input} />
                            </FormItem>
                            
                            <FormItem
                                label="Nom"
                                invalid={Boolean(errors.lastname && touched.lastname)}
                                errorMessage={errors.lastname as string}
                            >
                                <Field type="text" autoComplete="off" name="lastname" placeholder="Nom" component={Input} />
                            </FormItem>
                            
                            <FormItem
                                label="Entreprise"
                                invalid={Boolean(errors.companyName && touched.companyName)}
                                errorMessage={errors.companyName as string}
                            >
                                <Field type="text" autoComplete="off" name="companyName" placeholder="Entreprise" component={Input} />
                            </FormItem>
                           
                           <div className="mb-4">
                            <label className="font-semibold mb-2 block">Sites Internet</label>
                            <FieldArray
                                name="urls"
                                render={(arrayHelpers) => (
                                    <div>
                                        {arrayHelpers.form.values.urls && arrayHelpers.form.values.urls.length > 0 ? (
                                            arrayHelpers.form.values.urls.map((website: any, index: number) => (
                                                <div key={index} className="flex items-center gap-4 mb-4">
                                                    <FormItem 
                                                        className="w-full mb-0"
                                                        invalid={Boolean(
                                                            getIn(errors, `urls[${index}].url`) && 
                                                            getIn(touched, `urls[${index}].url`)
                                                        )}
                                                        errorMessage={getIn(errors, `urls[${index}].url`)}
                                                    >
                                                        <Field 
                                                            name={`urls[${index}].url`} 
                                                            placeholder="https://www.mon-site.com" 
                                                            component={Input} />
                                                    </FormItem>
                                                    <Button 
                                                        type="button" 
                                                        size="sm" 
                                                        variant="solid" 
                                                        color="red-600"
                                                        onClick={() => arrayHelpers.remove(index)}>
                                                        X
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 text-sm mb-4">Aucun site internet renseigné.</p>
                                        )}
                                        <Button
                                            type="button"
                                            size="sm"
                                            onClick={() => arrayHelpers.push({ url: '' })}>
                                            + Ajouter un site web
                                        </Button>
                                    </div>
                                )}
                            />
                        </div>
                            
                            <FormItem
                                label="Email"
                                invalid={Boolean(errors.mail && touched.mail)}
                                errorMessage={errors.mail as string}
                            >
                                <Field type="email" autoComplete="off" name="mail" placeholder="Email" component={Input} />
                            </FormItem>

                            {!isEditMode && (
                                <>
                                    <FormItem
                                        label="Mot de passe"
                                        invalid={Boolean(errors.password && touched.password)}
                                        errorMessage={errors.password as string}
                                    >
                                        <Field autoComplete="off" name="password" placeholder="Mot de passe" component={PasswordInput} />
                                    </FormItem>
                                    
                                    <FormItem
                                        label="Confirmation de mot de passe"
                                        invalid={Boolean(errors.confirmPassword && touched.confirmPassword)}
                                        errorMessage={errors.confirmPassword as string}
                                    >
                                        <Field autoComplete="off" name="confirmPassword" placeholder="Confirmation du mot de passe" component={PasswordInput} />
                                    </FormItem>
                                </>
                            )}

                            <Button block loading={isSubmitting} variant="solid" type="submit">
                                {isEditMode ? 'Mettre à jour le profil' : 'Créer un compte'}
                            </Button>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default SignUpForm