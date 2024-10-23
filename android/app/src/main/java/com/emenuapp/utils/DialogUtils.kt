package com.emenuapp_pk.utils

import android.content.Context
import android.os.Bundle
import androidx.appcompat.app.AlertDialog
import androidx.core.os.bundleOf
import com.emenew.genericprnt.EscPosCharsetEncoding
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.model.InstructionType
import com.emenuapp_pk.data.local.model.Manufacturer
import com.emenuapp_pk.data.local.model.PaperSize
import com.emenuapp_pk.data.local.model.PrinterType
//import io.ezeelabs.starprnt.utils.ModelCapability

typealias DialogCallback = (data: Bundle) -> Unit

object DialogUtils {
    const val EXTRA_ACTION = "action"
    const val EXTRA_PRINTER_TYPE = "printer_type"
    const val EXTRA_MANUFACTURER_ID = "manufacturer_id"
    const val EXTRA_PAPER_SIZE = "paper_size"
    const val EXTRA_INSTRUCTIONS_TYPE = "instructions_type"
    const val EXTRA_CHARACTER_SET = "character_set"
    const val EXTRA_MODEL_INDEX = "model_index"
    const val EXTRA_DRAWER_OPEN_STATUS = "drawer_open_status"

    fun characterSetSelectionDialog(ctx: Context, callback: DialogCallback) {
        val builder = AlertDialog.Builder(ctx)
        builder.setCancelable(false)

        builder.setTitle(ctx.getString(R.string.select_character_set_label))

        builder.setItems(
            EscPosCharsetEncoding.ENCODING_TYPES
        ) { d, i ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to true,
                    EXTRA_CHARACTER_SET to i
                )
            )
            d.dismiss()
        }

        builder.setNegativeButton(R.string.cancel) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to false,
                )
            )
            d.dismiss()
        }

        builder.show()
    }

    fun printerTypeSelectionDialog(
        ctx: Context,
        printerTypes: Array<PrinterType>,
        callback: DialogCallback
    ) {
        val builder = AlertDialog.Builder(ctx)
        builder.setCancelable(false)

        val items = arrayOfNulls<String>(printerTypes.size)
        printerTypes.forEachIndexed { i, printerType ->
            items[i] = ctx.getString(printerType.res)
        }

        builder.setTitle(ctx.getString(R.string.label_select_printer_type))
        builder.setItems(items) { d, i ->
            val printerTypeId = printerTypes[i].id
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to true,
                    EXTRA_PRINTER_TYPE to printerTypeId
                )
            )
            d.dismiss()
        }

        builder.setNegativeButton(R.string.cancel) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to false,
                )
            )
            d.dismiss()
        }

        builder.show()
    }

    fun manufacturerSelectionDialog(ctx: Context, callback: DialogCallback) {
        val builder = AlertDialog.Builder(ctx)
        builder.setCancelable(false)

        val manufacturer = arrayOf(
            Manufacturer.Star(),
            Manufacturer.Sunmi(),
        )

        builder.setTitle(ctx.getString(R.string.select_manufacturer_label))
        builder.setItems(
            arrayOf(
                ctx.getString(Manufacturer.Star().res),
                ctx.getString(Manufacturer.Sunmi().res)
            ),
        ) { d, i ->
            val manufacturerId = manufacturer[i].id
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to true,
                    EXTRA_MANUFACTURER_ID to manufacturerId
                )
            )
            d.dismiss()
        }

        builder.setNegativeButton(R.string.cancel) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to false,
                )
            )
            d.dismiss()
        }

        builder.show()
    }

    fun paperSizeSelectionDialog(ctx: Context, callback: DialogCallback) {
        val builder = AlertDialog.Builder(ctx)
        builder.setCancelable(false)

        builder.setTitle(ctx.getString(R.string.select_paper_size))

        builder.setItems(
            arrayOf(
                "2\" (384dots)",
                "3\" (576dots)"
            ),
        ) { d, i ->
            val selectedPaperSize = when (i) {
                0 -> PaperSize.TWO_INCH
                else -> PaperSize.THREE_INCH
            }
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to true,
                    EXTRA_PAPER_SIZE to selectedPaperSize
                )
            )
            d.dismiss()
        }

        builder.setNegativeButton(R.string.cancel) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to false,
                )
            )
            d.dismiss()
        }

        builder.show()
    }

    fun instructionTypeSelectionDialog(ctx: Context, callback: DialogCallback) {
        val builder = AlertDialog.Builder(ctx)
        builder.setCancelable(false)

        builder.setTitle(ctx.getString(R.string.select_instructions_type))

        builder.setItems(
            arrayOf(
                "POS",
                "Raster"
            ),
        ) { d, i ->
            val instructionsSet = when (i) {
                0 -> InstructionType.POS
                else -> InstructionType.RASTER
            }
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to true,
                    EXTRA_INSTRUCTIONS_TYPE to instructionsSet
                )
            )
            d.dismiss()
        }

        builder.setNegativeButton(R.string.cancel) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to false,
                )
            )
            d.dismiss()
        }

        builder.show()
    }

    fun modelSelectionDialog(ctx: Context, callback: DialogCallback) {
        val builder = AlertDialog.Builder(ctx)
        builder.setCancelable(false)
        builder.setTitle(ctx.getString(R.string.confirm_printer))
        builder.setItems(
            arrayOf(
                "mC-Print2",
                "mC-Print3",
                "mPOP",
                "FVP10",
                "TSP100",
                "TSP100IV",
                "TSP650II",
                "TSP700II",
                "TSP800II",
                "TUP500",
                "SP700",
                "SM-S210i",
                "SM-S220i",
                "SM-S230i",
                "SM-T300i/T300",
                "SM-T400i",
                "SM-L200",
                "SM-L300",
                "BSC10",
                "SM-S210i StarPRNT",
                "SM-S220i StarPRNT",
                "SM-S230i StarPRNT",
                "SM-T300i/T300 StarPRNT",
                "SM-T400i StarPRNT",
                "SK1-211/221/V211",
                "SK1-211/221/V211 Presenter",
                "SK1-311/321/V311",
                "SK1-311/V311 Presenter"
            )
        ) { d, i ->
//            val model = when (i) {
//               // 0 -> ModelCapability.MC_PRINT2
////                1 -> ModelCapability.MC_PRINT3
////                2 -> ModelCapability.MPOP
////                3 -> ModelCapability.FVP10
////                4 -> ModelCapability.TSP100
////                5 -> ModelCapability.TSP100IV
////                6 -> ModelCapability.TSP650II
////                7 -> ModelCapability.TSP700II
////                8 -> ModelCapability.TSP800II
////                9 -> ModelCapability.TUP500
////                10 -> ModelCapability.SP700
////                11 -> ModelCapability.SM_S210I
////                12 -> ModelCapability.SM_S220I
////                13 -> ModelCapability.SM_S230I
////                14 -> ModelCapability.SM_T300I_T300
////                15 -> ModelCapability.SM_T400I
////                16 -> ModelCapability.SM_L200
////                17 -> ModelCapability.SM_L300
////                18 -> ModelCapability.BSC10
////                19 -> ModelCapability.SM_S210I_StarPRNT
////                20 -> ModelCapability.SM_S220I_StarPRNT
////                21 -> ModelCapability.SM_S230I_StarPRNT
////                22 -> ModelCapability.SM_T300I_T300_StarPRNT
////                23 -> ModelCapability.SM_T400I_StarPRNT
////                24 -> ModelCapability.SK1_211_221_V211
////                25 -> ModelCapability.SK1_211_221_V211_Presenter
////                26 -> ModelCapability.SK1_311_321_V311
////                27 -> ModelCapability.SK1_311_V311_Presenter
////                else -> ModelCapability.NONE
//            }
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to true,
                    EXTRA_MODEL_INDEX to ""
                )
            )
            d.dismiss()
        }

        builder.setNegativeButton(R.string.cancel) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to false,
                )
            )
            d.dismiss()
        }

        builder.show()
    }

    fun drawerOpenStatusDialog(ctx: Context, callback: DialogCallback) {
        val builder = AlertDialog.Builder(ctx)
        builder.setCancelable(false)
        builder.setTitle(ctx.getString(R.string.select_cash_drawer_status))
        builder.setItems(
            arrayOf(
                "High when Open",
                "Low when Open"
            )
        ) { d, i ->
            val activeHigh = when (i) {
                0 -> true
                else -> false
            }
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to true,
                    EXTRA_DRAWER_OPEN_STATUS to activeHigh
                )
            )
            d.dismiss()
        }

        builder.setNegativeButton(R.string.cancel) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to false,
                )
            )
            d.dismiss()
        }

        builder.show()
    }

    fun modelConfirmationDialog(ctx: Context, modelIndex: Int, callback: DialogCallback) {
        val builder = AlertDialog.Builder(ctx)

        val modelTitle ="" //ModelCapability.getModelTitle(modelIndex)

        builder.setTitle(ctx.getString(R.string.confirm))
        builder.setMessage(ctx.getString(R.string.is_your_printer, modelTitle))

        builder.setPositiveButton(ctx.getString(R.string.yes)) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to true,
                    EXTRA_MODEL_INDEX to modelIndex
                )
            )
            d.dismiss()
        }
        builder.setNegativeButton(ctx.getString(R.string.no)) { d, _ ->
            callback.invoke(
                bundleOf(
                    EXTRA_ACTION to false,
                    EXTRA_MODEL_INDEX to modelIndex
                )
            )
            d.dismiss()
        }

        builder.show()
    }
}