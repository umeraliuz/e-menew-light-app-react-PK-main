import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { images } from "../../../assets/images";
import { PersonaliserList } from "../../../constant/constantList";
import { Strings } from "../../../constant/string";
import Design from "./design";

const PersonaliserScreen = () => {
    const [personaliserList, setPersonaliserList] = useState('')
    const { t } = useTranslation()

    const PersonaliserList = [
        {
            name: t("A_COTE"),
            image: images.logoutIcon,
            isSelected: false

        },
        {
            name: t("AVEC"),
            image: images.heartIcon,
            isSelected: false

        },
        {
            name: t("SANS"),
            image: images.blockIcon,
            isSelected: false

        },
        {
            name: t("REMPLACER"),
            image: images.replaceIcon,
            isSelected: false

        },
        {
            name: t("KEYBOARD"),
            image: images.keyboardIcon,
            isSelected: false

        },
        {
            name: t("COMMENTS_COMMENTAIRES"),
            image: images.commentIcon,
            isSelected: false

        },
        {
            name: t("INSTRUCTION_PRODUCTION"),
            image: images.choiceIcon,
            isSelected: false

        },
        {
            name: t("AJOUTER"),
            image: images.plusIcon,
            isSelected: false

        },
        {
            name: t("SUPPRIMER"),
            image: images.deleteIcon,
            isSelected: false

        },
    ]
    return (
        <Design
            personaliserList={PersonaliserList}
        />
    )

}
export default PersonaliserScreen