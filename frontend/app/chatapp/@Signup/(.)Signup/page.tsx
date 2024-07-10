import DialogBox from "../../components/ui/dialogbox";
import SignUpForm from "../../components/ui/SingupForm";

export default function SignUpModel(){
    return(
        <DialogBox defaultOpen={true} Title="Create An Account" trgrBtn={<></>}>
            <SignUpForm className="w-72 md:w-96"/>
        </DialogBox>
    )
}