package com.emenuapp_pk.ui.history

import android.content.DialogInterface
import android.content.Intent
import android.net.Uri
import android.view.View
import androidx.appcompat.app.AlertDialog
import androidx.recyclerview.widget.LinearLayoutManager
import com.emenuapp_pk.R
import com.emenuapp_pk.data.local.db.DbHelper
import com.emenuapp_pk.databinding.FragmentHistoryBinding
import com.emenuapp_pk.ui.base.BaseFragment
import com.emenuapp_pk.ui.base.recycler.ItemOffsetDecoration

class HistoryFragment : BaseFragment<FragmentHistoryBinding>(R.layout.fragment_history) {
    private var historyAdapter: HistoryAdapter = HistoryAdapter()


    override fun provideBinding(view: View): FragmentHistoryBinding {
        return FragmentHistoryBinding.inflate(layoutInflater)
    }

    override fun setup() {
        historyAdapter.apply {
            addItems(DbHelper.instance.history)
            setOnItemClickListener(object : HistoryAdapter.OnItemClickListener {
                override fun onItemClick(position: Int, item: Uri) {
                    val content = item.getQueryParameter("content")
                    AlertDialog.Builder(requireContext())
                        .setCancelable(false)
                        .setMessage(content)
                        .setPositiveButton(R.string.reprint) { dialogInterface: DialogInterface, _: Int ->
                            dialogInterface.dismiss()
                            val intent = Intent(Intent.ACTION_VIEW, item)
                            startActivity(intent)
                        }
                        .setNegativeButton(R.string.close) { dialogInterface: DialogInterface, _: Int -> dialogInterface.dismiss() }
                        .show()
                }
            })
        }

        binding.list.apply {
            layoutManager = LinearLayoutManager(
                requireContext(),
                LinearLayoutManager.VERTICAL,
                false
            )
            addItemDecoration(
                ItemOffsetDecoration(
                    requireContext(),
                    R.dimen.item_offset
                )
            )

            adapter = historyAdapter
        }
    }
}