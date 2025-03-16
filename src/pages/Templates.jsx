import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import Layout from "../components/Layout";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

function Templates() {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        password: "",
        duration: "",
        paymentAmount: "",
        paymentMethod: "",
        paymentLink: "",
        accessLink: "",
        guideLink: "",
        coupon: "",
        m3u:"",
        codes: ""
    });

    const templateOptions = [
        { name: "Essai Gratuit", code: "free_trial" },
        { name: "Promotion du Mois", code: "promo" },
        { name: "Paiement Confirmé", code: "payment" },
        { name: "Paiement en Attente", code: "pending" },
        { name: "Coupon Gratuit", code: "coupon" }
    ];

    // Email templates with placeholders
    const templateData = {
        free_trial: `Objet : Activation de votre essai gratuit de 2 heures 🎉

        Bonjour {name},

        Nous avons le plaisir de vous informer que votre essai gratuit de 2 heures a été activé avec succès. Vous pouvez dès à présent profiter de notre service en utilisant les identifiants suivants :

        Codes D'activation :

        {codes}

        Lien M3U : {m3u}

        Par ailleurs, nous proposons actuellement des offres spéciales sur nos abonnements de 12 mois et les abonnements doubles. N’hésitez pas à les découvrir sur cette page : platinium-iptv.com/produits.

        Si vous avez des questions ou besoin d’assistance, notre équipe reste à votre disposition.

        Bonne découverte et à bientôt !

        L'équipe Platinium IPTV`,

                promo: `📢 Promotion du Mois – Ne Manquez Pas Ces Offres Exceptionnelles ! 

        Cher clients PLATINIUM,

        Ce mois-ci, profitez de nos offres spéciales sur les abonnements IPTV double durée ! 

        ✨ Abonnement IPTV PREMIUM 3 Mois + 6 Mois Offerts → 70,00€ au lieu de 85,00€
        ✨ Abonnement IPTV PREMIUM 12 Mois + 6 Mois Offerts → 80,00€ au lieu de 100,00€
        ✨ Abonnement IPTV PREMIUM 15 Mois + 3 Mois Offerts → 95,00€ au lieu de 125,00€
        ✨ Abonnement IPTV PREMIUM 12 Mois + 3 Mois Offerts → 75,00€ au lieu de 95,00€

        Dépêchez-vous ! Ces offres sont limitées dans le temps !

        Commandez dès maintenant sur platinium-iptv.com/produits et bénéficiez du meilleur service IPTV avec des chaînes HD, VOD et bien plus encore.

        Pour toute question, notre équipe est à votre disposition !

        Profitez-en avant la fin du mois !`,

        payment: `Objet : Confirmation de paiement & détails de votre abonnement PLATINIUM

        Bonjour {name},

        Nous avons bien reçu votre paiement et nous vous remercions pour votre confiance ! 

        Voici les informations de votre abonnement IPTV :

        Xtream Codes :

        {codes}

        Lien M3U :

        {m3u}

        ✔️ Votre abonnement est maintenant actif ! Vous pouvez profiter de milliers de chaînes, films et séries en toute fluidité.

        📌 Besoin d’aide ? Notre support est disponible pour vous accompagner à tout moment.

        Merci encore pour votre achat et bon streaming ! 

        L'équipe Platinium IPTV`,

        pending: `Objet : Paiement en attente – Finalisez votre commande !

        Bonjour {name},

        Nous avons remarqué que votre paiement pour l'abonnement IPTV est toujours en attente. Pour activer votre abonnement et profiter de notre service, merci de finaliser votre paiement dès que possible.

        🔹 Montant : {paymentAmount}
        🔹 Méthode de paiement : {paymentMethod}

        📌 Une fois le paiement effectué, vous recevrez immédiatement vos identifiants d'accès.

        Si vous avez déjà effectué le paiement, veuillez nous envoyer une confirmation afin que nous puissions traiter votre commande rapidement.

        Pour toute assistance, notre équipe reste à votre disposition.

        Finalisez votre commande maintenant et commencez à profiter de votre abonnement IPTV !

        L'équipe Platinium IPTV`,

        coupon: `Objet : 🎁 Votre Coupon Gratuit Platinium IPTV 🎉

        Bonjour {name},

        Nous avons une bonne nouvelle pour vous ! 🎊 En tant que client privilégié, nous vous offrons un coupon gratuit à utiliser immédiatement.

        Code du Coupon : {coupon}

        - Utilisez ce code lors de votre commande sur platinium-iptv.com/produits pour bénéficier de votre réduction.

        ⚠️Attention : Ce coupon est valable pour une durée limitée, alors profitez-en rapidement !

        Si vous avez des questions ou besoin d’aide, notre équipe est à votre disposition.

        Bonne utilisation et à très bientôt !

        L'équipe Platinium IPTV`
    };

    // Handle input changes
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Generate the template with user inputs
    const generateTemplate = () => {
        if (!selectedTemplate) return "";
        return templateData[selectedTemplate.code]
            .replace("{name}", formData.name || "_____")
            .replace("{codes}", formData.codes || "_____")
            .replace("{m3u}", formData.m3u || "_____")
            .replace("{duration}", formData.duration || "_____")
            .replace("{paymentAmount}", formData.paymentAmount || "_____")
            .replace("{paymentMethod}", formData.paymentMethod || "_____")
            .replace("{paymentLink}", formData.paymentLink || "_____")
            .replace("{accessLink}", formData.accessLink || "_____")
            .replace("{guideLink}", formData.guideLink || "_____")
            .replace("{coupon}", formData.coupon || "_____");
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateTemplate());
        alert("Template copié dans le presse-papiers !");
    };

    return (
        <Layout>
            <h1 className="text-3xl"> Emails & Factures - Modèles </h1>

            <Dropdown
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.value)}
                options={templateOptions}
                optionLabel="name"
                placeholder="Sélectionnez un Modèle"
                className="w-full md:w-14rem mt-8"
            />

            {selectedTemplate && (
                <div className="mt-8 p-5 border rounded bg-pink-400/15">
                    <h2 className="text-xl">{selectedTemplate.name}</h2>

                    {/* Input Fields */}
                    <input type="text" name="name" placeholder="Nom du Client" onChange={handleInputChange} className="border p-2 w-full rounded mt-2" />
                    {selectedTemplate.code === "free_trial" || selectedTemplate.code === "payment" ? (
                        <>
                            <InputTextarea type="text" name="codes" placeholder="Codes D'abonnement" cols={50} rows={5} onChange={handleInputChange} className="border p-2 w-full rounded mt-2" />
                            <InputText type="text" name="m3u" placeholder="Lien M3U" onChange={handleInputChange} className="border p-2 w-full rounded mt-2" />
                        </>
                    ) : null}

                    {selectedTemplate.code === "pending" ? (
                        <>
                            <InputText type="text" name="paymentAmount" placeholder="Montant" onChange={handleInputChange} className="border p-2 w-full rounded mt-2" />
                            <InputText type="text" name="paymentMethod" placeholder="Methode" onChange={handleInputChange} className="border p-2 w-full rounded mt-2" />
                        </>
                    ) : null}

                    {selectedTemplate.code === "coupon" ? (
                        <>
                            <InputText type="text" name="coupon" placeholder="Montant" onChange={handleInputChange} className="border p-2 w-full rounded mt-2" />
                        </>
                    ) : null}

                    {/* Preview & Copy */}
                    <div className="mt-6 p-4 border rounded bg-white">
                        <pre className="whitespace-pre-wrap font-roboto">{generateTemplate()}</pre>
                    </div>

                    <Button onClick={copyToClipboard} className="mt-4 bg-pink-600 gap-3 text-white px-4 py-2 rounded hover:bg-pink-700" icon="pi pi-clipboard">
                        Copier le Modèle
                    </Button>
                </div>
            )}
        </Layout>
    );
}

export default Templates;
