package io.ezeelabs.starprnt.data.model

import com.starmicronics.starioextension.StarIoExt.Emulation
import com.starmicronics.starioextension.StarIoExt.LedModel

class ModelInfo(
    var modelTitle: String,
    var modelNameArray: Array<String>,
    var emulation: Emulation,
    var defaultPortSettings: String,
    var defaultPaperSize: Int,
    var canSetDrawerOpenStatus: Boolean,
    var canPrintTextReceiptSample: Boolean,
    var canPrintUtf8EncodedText: Boolean,
    var canPrintRasterReceiptSample: Boolean,
    var canPrintCjk: Boolean,
    var canUseBlackMark: Boolean,
    var canUseBlackMarkDetection: Boolean,
    var canUsePageMode: Boolean,
    var canUseCashDrawer: Boolean,
    var canUseBarcodeReader: Boolean,
    var canUseCustomerDisplay: Boolean,
    var canUsePresenter: Boolean,
    var canUseLed: Boolean,
    var ledModel: LedModel,
    var canUseBlinkLed: Boolean,
    var canUsePaperPresentStatus: Boolean,
    var canGetProductSerialNumber: Boolean,
    var settableUsbSerialNumberLength: Int,
    var isUsbSerialNumberEnabledByDefault: Boolean,
    var canUseMelodySpeaker: Boolean,
    var defaultSoundNumber: Int,
    var defaultVolume: Int,
    var volumeMax: Int,
    var volumeMin: Int,
    var canUseAutoSwitchInterface: Boolean,
)