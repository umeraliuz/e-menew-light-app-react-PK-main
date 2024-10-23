package com.emenuapp_pk.ui.log

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import com.emenuapp_pk.R
import com.emenuapp_pk.databinding.ActivityExceptionLogBinding
import com.emenuapp_pk.ui.base.BaseActivity

class ExceptionLogActivity : BaseActivity<ActivityExceptionLogBinding>() {
    private var errorStr: String? = null

    override fun provideBinding(): ActivityExceptionLogBinding {
        return ActivityExceptionLogBinding.inflate(layoutInflater)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (intent.hasExtra("error")) {
            errorStr = intent.getStringExtra("error")
        } else {
            finish()
        }

        supportActionBar?.setTitle(R.string.label_exception_log)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        if (errorStr != null) {
            binding.errorLog.text = errorStr
        }
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            finish()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    companion object {
        fun newIntent(context: Context?, error: String?): Intent {
            val intent = Intent(context, ExceptionLogActivity::class.java)
            intent.putExtra("error", error)
            return intent
        }
    }
}