package io.ezeelabs.starprnt.utils

import android.util.SparseArray
import com.starmicronics.starioextension.StarIoExt.Emulation
import com.starmicronics.starioextension.StarIoExt.LedModel
import io.ezeelabs.starprnt.data.model.ModelInfo
import io.ezeelabs.starprnt.data.model.StarPaperSize

public object ModelCapability {
    const val NONE = -1
    const val MPOP = 0
    const val FVP10 = 1
    const val TSP100 = 2
    const val TSP650II = 3
    const val TSP700II = 4
    const val TSP800II = 5
    const val SP700 = 6
    const val SM_S210I = 7
    const val SM_S220I = 8
    const val SM_S230I = 9
    const val SM_T300I_T300 = 10
    const val SM_T400I = 11
    const val SM_L200 = 12
    const val BSC10 = 13
    const val SM_S210I_StarPRNT = 14
    const val SM_S220I_StarPRNT = 15
    const val SM_S230I_StarPRNT = 16
    const val SM_T300I_T300_StarPRNT = 17
    const val SM_T400I_StarPRNT = 18
    const val SM_L300 = 19
    const val MC_PRINT2 = 20
    const val MC_PRINT3 = 21
    const val TUP500 = 22
    const val SK1_211_221_V211 = 23
    const val SK1_211_221_V211_Presenter = 24
    const val SK1_311_321_V311 = 25
    const val SK1_311_V311_Presenter = 26
    const val TSP100IV = 27

    private val modelCapabilityMap = SparseArray<ModelInfo>()

    init {
        modelCapabilityMap.apply {
            put(
                MC_PRINT2,
                ModelInfo(
                    modelTitle = "mC-Print2",
                    modelNameArray = arrayOf(
                        "MCP20 (STR-001)",
                        "MCP21 (STR-001)",
                        "mC-Print2-",
                        "mC-Print2"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = true,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = true,
                    canUseCustomerDisplay = true,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = true,
                    settableUsbSerialNumberLength = 16,
                    isUsbSerialNumberEnabledByDefault = true,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = true
                )
            )
            put(
                MC_PRINT3,
                ModelInfo(
                    modelTitle = "mC-Print3",
                    modelNameArray = arrayOf(
                        "MCP31 (STR-001)",
                        "mC-Print3-",
                        "mC-Print3"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = true,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = true,
                    canUseCustomerDisplay = true,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = true,
                    settableUsbSerialNumberLength = 16,
                    isUsbSerialNumberEnabledByDefault = true,
                    canUseMelodySpeaker = true,
                    defaultSoundNumber = 0,
                    defaultVolume = 12,
                    volumeMax = 15,
                    volumeMin = 0,
                    canUseAutoSwitchInterface = true
                )
            )
            put(
                MPOP,
                ModelInfo(
                    modelTitle = "mPOP",
                    modelNameArray = arrayOf(
                        "STAR mPOP-",
                        "mPOP"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = true,
                    canUseCustomerDisplay = true,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = true,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                FVP10,
                ModelInfo(
                    modelTitle = "FVP10",
                    modelNameArray = arrayOf(
                        "FVP10 (STR_T-001)",
                        "Star FVP10"
                    ),
                    emulation = Emulation.StarLine,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = true,
                    defaultSoundNumber = 1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                TSP100,
                ModelInfo(
                    modelTitle = "TSP100",
                    modelNameArray = arrayOf(
                        "TSP113", "TSP143",
                        "TSP100-",
                        "Star TSP113", "Star TSP143"
                    ),
                    emulation = Emulation.StarGraphic,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = false,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = false,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = true,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = true,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                TSP650II,
                ModelInfo(
                    modelTitle = "TSP650II",
                    modelNameArray = arrayOf(
                        "TSP654II (STR_T-001)",
                        "TSP654 (STR_T-001)",
                        "TSP651 (STR_T-001)"
                    ),
                    emulation = Emulation.StarLine,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = true,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = true,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                TSP700II,
                ModelInfo(
                    modelTitle = "TSP700II",
                    modelNameArray = arrayOf(
                        "TSP743II (STR_T-001)",
                        "TSP743 (STR_T-001)"
                    ),
                    emulation = Emulation.StarLine,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                TSP800II,
                ModelInfo(
                    modelTitle = "TSP800II",
                    modelNameArray = arrayOf(
                        "TSP847II (STR_T-001)",
                        "TSP847 (STR_T-001)"
                    ),
                    emulation = Emulation.StarLine,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.FOUR_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = false,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                TUP500,
                ModelInfo(
                    modelTitle = "TUP500",
                    modelNameArray = arrayOf(
                        "TUP592 (STR_T-001)",
                        "TUP542 (STR_T-001)"
                    ),
                    emulation = Emulation.StarLine,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = false,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = true,
                    canUseLed = true,
                    ledModel = LedModel.Star,
                    canUseBlinkLed = true,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = 1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SP700,
                ModelInfo(
                    modelTitle = "SP700",
                    modelNameArray = arrayOf(
                        "SP712 (STR-001)",
                        "SP717 (STR-001)",
                        "SP742 (STR-001)",
                        "SP747 (STR-001)"
                    ),
                    emulation = Emulation.StarDotImpact,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.DOT_THREE_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = false,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = false,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_S210I,
                ModelInfo(
                    modelTitle = "SM-S210i",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.EscPosMobile,
                    defaultPortSettings = "mini",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_S220I,
                ModelInfo(
                    modelTitle = "SM-S220i",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.EscPosMobile,
                    defaultPortSettings = "mini",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_S230I,
                ModelInfo(
                    modelTitle = "SM-S230i",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.EscPosMobile,
                    defaultPortSettings = "mini",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_T300I_T300,
                ModelInfo(
                    modelTitle = "SM-T300i/T300",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.EscPosMobile,
                    defaultPortSettings = "mini",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_T400I,
                ModelInfo(
                    modelTitle = "SM-T400i",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.EscPosMobile,
                    defaultPortSettings = "mini",
                    defaultPaperSize = StarPaperSize.FOUR_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_L200,
                ModelInfo(
                    modelTitle = "SM-L200",
                    modelNameArray = arrayOf(
                        "STAR L200-",
                        "STAR L204-"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "Portable",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_L300,
                ModelInfo(
                    modelTitle = "SM-L300",
                    modelNameArray = arrayOf(
                        "STAR L300-",
                        "STAR L304-"
                    ),
                    emulation = Emulation.StarPRNTL,
                    defaultPortSettings = "Portable",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                BSC10,
                ModelInfo(
                    modelTitle = "BSC10",
                    modelNameArray = arrayOf(
                        "BSC10",
                        "Star BSC10"
                    ),
                    emulation = Emulation.EscPos,
                    defaultPortSettings = "escpos",
                    defaultPaperSize = StarPaperSize.ESCPOS_THREE_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_S210I_StarPRNT,
                ModelInfo(
                    modelTitle = "SM-S210i StarPRNT",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "Portable",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_S220I_StarPRNT,
                ModelInfo(
                    modelTitle = "SM-S220i StarPRNT",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "Portable",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_S230I_StarPRNT,
                ModelInfo(
                    modelTitle = "SM-S230i StarPRNT",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "Portable",
                    defaultPaperSize = StarPaperSize.TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 8,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_T300I_T300_StarPRNT,
                ModelInfo(
                    modelTitle = "SM-T300i StarPRNT",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "Portable",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SM_T400I_StarPRNT,
                ModelInfo(
                    modelTitle = "SM-T400i StarPRNT",
                    modelNameArray = arrayOf(),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "Portable",
                    defaultPaperSize = StarPaperSize.FOUR_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = false,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 0,
                    isUsbSerialNumberEnabledByDefault = false,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SK1_211_221_V211,
                ModelInfo(
                    modelTitle = "SK1-211/221/V211",
                    modelNameArray = arrayOf(
                        "SK1-211_221"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.SK1_TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = true,
                    ledModel = LedModel.SK,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = true,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 16,
                    isUsbSerialNumberEnabledByDefault = true,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SK1_211_221_V211_Presenter,
                ModelInfo(
                    modelTitle = "SK1-211/221/V211 Presenter",
                    modelNameArray = arrayOf(
                        "SK1-211_221 Presenter"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.SK1_TWO_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = true,
                    canUseLed = true,
                    ledModel = LedModel.SK,
                    canUseBlinkLed = true,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 16,
                    isUsbSerialNumberEnabledByDefault = true,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SK1_311_321_V311,
                ModelInfo(
                    modelTitle = "SK1-311/321/V311",
                    modelNameArray = arrayOf(
                        "SK1-311_321"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = false,
                    canUseLed = true,
                    ledModel = LedModel.SK,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = true,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 16,
                    isUsbSerialNumberEnabledByDefault = true,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                SK1_311_V311_Presenter,
                ModelInfo(
                    modelTitle = "SK1-311/V311 Presenter",
                    modelNameArray = arrayOf(
                        "SK1-311 Presenter"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = false,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = false,
                    canUseBlackMark = true,
                    canUseBlackMarkDetection = true,
                    canUsePageMode = true,
                    canUseCashDrawer = false,
                    canUseBarcodeReader = false,
                    canUseCustomerDisplay = false,
                    canUsePresenter = true,
                    canUseLed = true,
                    ledModel = LedModel.SK,
                    canUseBlinkLed = true,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = false,
                    settableUsbSerialNumberLength = 16,
                    isUsbSerialNumberEnabledByDefault = true,
                    canUseMelodySpeaker = false,
                    defaultSoundNumber = -1,
                    defaultVolume = -1,
                    volumeMax = -1,
                    volumeMin = -1,
                    canUseAutoSwitchInterface = false
                )
            )
            put(
                TSP100IV,
                ModelInfo(
                    modelTitle = "TSP100IV",
                    modelNameArray = arrayOf(
                        "TSP143IV (STR-001)",
                        "Star TSP143IV-UE"
                    ),
                    emulation = Emulation.StarPRNT,
                    defaultPortSettings = "",
                    defaultPaperSize = StarPaperSize.THREE_INCH,
                    canSetDrawerOpenStatus = true,
                    canPrintTextReceiptSample = true,
                    canPrintUtf8EncodedText = true,
                    canPrintRasterReceiptSample = true,
                    canPrintCjk = true,
                    canUseBlackMark = false,
                    canUseBlackMarkDetection = false,
                    canUsePageMode = true,
                    canUseCashDrawer = true,
                    canUseBarcodeReader = true,
                    canUseCustomerDisplay = true,
                    canUsePresenter = false,
                    canUseLed = false,
                    ledModel = LedModel.None,
                    canUseBlinkLed = false,
                    canUsePaperPresentStatus = false,
                    canGetProductSerialNumber = true,
                    settableUsbSerialNumberLength = 16,
                    isUsbSerialNumberEnabledByDefault = true,
                    canUseMelodySpeaker = true,
                    defaultSoundNumber = 0,
                    defaultVolume = 12,
                    volumeMax = 15,
                    volumeMin = 0,
                    canUseAutoSwitchInterface = true
                )
            )
        }
    }

    fun getModelTitle(model: Int): String {
        return modelCapabilityMap.get(model).modelTitle
    }

    fun getEmulation(model: Int): Emulation {
        return modelCapabilityMap.get(model).emulation
    }

    fun getPortSettings(model: Int): String {
        return modelCapabilityMap.get(model).defaultPortSettings
    }

    fun canSetDrawerOpenStatus(model: Int): Boolean {
        return modelCapabilityMap.get(model).canSetDrawerOpenStatus
    }

    fun canPrintTextReceiptSample(model: Int): Boolean {
        return modelCapabilityMap.get(model).canPrintTextReceiptSample
    }

    fun canPrintUtf8EncodedText(model: Int): Boolean {
        return modelCapabilityMap.get(model).canPrintUtf8EncodedText
    }

    fun canPrintRasterReceiptSample(model: Int): Boolean {
        return modelCapabilityMap.get(model).canPrintRasterReceiptSample
    }

    fun canPrintCjk(model: Int): Boolean {
        return modelCapabilityMap.get(model).canPrintCjk
    }

    fun canUseBlackMark(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUseBlackMark
    }

    fun canUseBlackMarkDetection(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUseBlackMarkDetection
    }

    fun canUsePageMode(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUsePageMode
    }

    fun canUseCashDrawer(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUseCashDrawer
    }

    fun canUseBarcodeReader(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUseBarcodeReader
    }

    fun canUseCustomerDisplay(model: Int, modelName: String): Boolean {
        var canUse: Boolean = modelCapabilityMap.get(model).canUseCustomerDisplay
        if (model == TSP100) {
            canUse =
                modelName == modelCapabilityMap.get(TSP100).modelTitle || modelName == "Star TSP143IIIU" // Support TSP100IIIU.
            // Not support TSP100LAN, TSP100U, TSP100GT, TSP100IIU, TSP100IIILAN, TSP100IIIW and TSP100IIIBI.
        }
        return canUse
    }

    fun canUsePresenter(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUsePresenter
    }

    fun canUseLed(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUseLed
    }

    fun getLedModel(model: Int): LedModel? {
        return modelCapabilityMap.get(model).ledModel
    }

    fun canUseBlinkLed(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUseBlinkLed
    }

    fun canUsePaperPresentStatus(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUsePaperPresentStatus
    }

    fun canGetProductSerialNumber(
        model: Int,
        modelName: String,
        isBluetoothInterface: Boolean
    ): Boolean {
        var canGet: Boolean =
            modelCapabilityMap.get(model).canGetProductSerialNumber
        if (model == TSP100) {
            canGet =
                modelName == modelCapabilityMap.get(TSP100).modelTitle || modelName == "TSP143IIILAN (STR_T-001)" || modelName == "TSP143IIIW (STR_T-001)" ||  // Support TSP100IIIW.
                        isBluetoothInterface || modelName == "Star TSP143IIIU" // Support TSP100IIIU.
            // Not support TSP100LAN, TSP100U, TSP100GT and TSP100IIU.
        }
        return canGet
    }

    fun settableUsbSerialNumberLength(model: Int, modelName: String, isUsbInterface: Boolean): Int {
        var length: Int =
            modelCapabilityMap.get(model).settableUsbSerialNumberLength
        if (model == TSP100) {
            if (!isUsbInterface) {
                return 0
            }
            length =
                if (modelName == modelCapabilityMap.get(TSP100).modelTitle || modelName == "Star TSP143IIIU") {                          // TSP100IIIU supports 16digits USB-ID.
                    16
                } else {                                                              // TSP100U, TSP100GT and TSP100IIU support 8digits USB-ID.
                    8
                }
        }
        if (model == BSC10 && !isUsbInterface) {                                // It is useless to set a USB serial number to BSC10LAN.
            length = 0
        }
        return length
    }

    fun isUsbSerialNumberEnabledByDefault(model: Int): Boolean {
        return modelCapabilityMap.get(model).isUsbSerialNumberEnabledByDefault
    }

    fun canUseMelodySpeaker(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUseMelodySpeaker
    }

    fun getDefaultSoundNumber(model: Int): Int {
        return modelCapabilityMap.get(model).defaultSoundNumber
    }

    fun getDefaultVolume(model: Int): Int {
        return modelCapabilityMap.get(model).defaultVolume
    }

    fun getVolumeMax(model: Int): Int {
        return modelCapabilityMap.get(model).volumeMax
    }

    fun getVolumeMin(model: Int): Int {
        return modelCapabilityMap.get(model).volumeMin
    }

    fun canUseAutoSwitchInterface(model: Int): Boolean {
        return modelCapabilityMap.get(model).canUseAutoSwitchInterface
    }

    /**
     * Get a model index from model name string that can be got by
     * PortInfo.getModelName() or PortInfo.getPortName();
     */
    fun getModel(modelNameSrc: String): Int {
        // Perfect match
        for (i in 0 until modelCapabilityMap.size()) {
            for (modelName in modelCapabilityMap.valueAt(i).modelNameArray) {
                if (modelNameSrc == modelName) {
                    return modelCapabilityMap.keyAt(i)
                }
            }
        }

        // Partial match from the head
        for (i in 0 until modelCapabilityMap.size()) {
            for (modelName in modelCapabilityMap.valueAt(i).modelNameArray) {
                if (modelNameSrc.startsWith(modelName)) {
                    return modelCapabilityMap.keyAt(i)
                }
            }
        }
        return NONE
    }
}