import nodemailer from "nodemailer"

const sendEmail = async(to,subject,html)=>{
    try{
        const { EMAIL_USER, EMAIL_PASSWORD } = process.env;
        if (!EMAIL_USER || !EMAIL_PASSWORD) {
            throw new Error("EMAIL_USER and EMAIL_PASSWORD must be configured");
        }

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user: EMAIL_USER,
                pass: EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from:`"Pizza Delivery" <${EMAIL_USER}>`,
            to:to,
            subject:subject,
            html:html
        });
        console.log("Email sent successfully")
    }catch(error){
        console.log("Email sending failed: ",error.message);
        throw error;
    }
}

export default sendEmail;