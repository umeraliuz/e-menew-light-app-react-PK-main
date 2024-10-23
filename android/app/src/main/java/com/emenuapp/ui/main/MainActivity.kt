package com.emenuapp_pk.ui.main

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.view.View
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.emenuapp_pk.R
import com.emenuapp_pk.databinding.ActivityMainBinding
import com.emenuapp_pk.ui.base.BaseActivity

class MainActivity : BaseActivity<ActivityMainBinding>() {

    private lateinit var navController: NavController

    private val handler = Handler(Looper.getMainLooper())


//    private val railToggleRunnable = Runnable {
//        if (binding.navigationRailView.visibility == View.VISIBLE) {
//            binding.navigationRailView.animate()
//                .translationX(-binding.navigationRailView.width.toFloat())
//                .setListener(object : AnimatorListenerAdapter() {
//                    override fun onAnimationEnd(animation: Animator) {
//                        super.onAnimationEnd(animation)
//                        binding.navigationRailView.visibility = View.GONE
//                        binding.railToggleButton.isSelected = false
//                    }
//                })
//        }
//    }

    override fun provideBinding(): ActivityMainBinding {

        return ActivityMainBinding.inflate(layoutInflater)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (::navController.isInitialized) {
        (supportFragmentManager.findFragmentById(R.id.nav_host_fragment) as NavHostFragment).let {

                navController = it.navController

           //     binding.navigationRailView.setupWithNavController(navController)
            }
        }

//        handler.postDelayed(railToggleRunnable, 10000)
////        binding.railToggleButton.isSelected = true
//        binding.railToggleButton.setOnClickListener {
//            val isRailVisible = binding.navigationRailView.visibility == View.VISIBLE
//            if (isRailVisible) {
//                binding.navigationRailView.animate()
//                    .translationX(-binding.navigationRailView.width.toFloat())
//                    .setListener(object : AnimatorListenerAdapter() {
//                        override fun onAnimationEnd(animation: Animator) {
//                            super.onAnimationEnd(animation)
//                            binding.navigationRailView.visibility = View.GONE
////                            binding.railToggleButton.isSelected = false
//                        }
//                    })
//            } else {
//                binding.navigationRailView.animate()
//                    .translationX(0.0f)
//                    .setListener(object : AnimatorListenerAdapter() {
//                        override fun onAnimationStart(animation: Animator) {
//                            super.onAnimationStart(animation)
//                            binding.navigationRailView.visibility = View.VISIBLE
////                            binding.railToggleButton.isSelected = true
//                        }
//                    })
//            }
//
//            handler.removeCallbacks(railToggleRunnable)
//            handler.postDelayed(railToggleRunnable, 10000)
//        }
    }

    companion object {
        fun newIntent(ctx: Context): Intent {
            return Intent(ctx, MainActivity::class.java)
        }
    }
}