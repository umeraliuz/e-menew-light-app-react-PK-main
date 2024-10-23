package com.emenuapp_pk.ui.history.adapter

import android.net.Uri
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.emenuapp_pk.data.local.model.History
import com.emenuapp_pk.databinding.ItemHistoryBinding
import java.text.SimpleDateFormat
import java.util.*

class HistoryAdapter : RecyclerView.Adapter<HistoryAdapter.ViewHolder>() {
    private val list: MutableList<History>
    private var listener: OnItemClickListener? = null

    private fun addItem(item: History) {
        list.add(item)
        notifyItemInserted(itemCount)
    }

    fun addItems(items: List<History>) {
        list.clear()
        for (item in items) {
            addItem(item)
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemHistoryBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.onBind(position)
    }

    override fun getItemCount(): Int {
        return list.size
    }

    fun setOnItemClickListener(listener: OnItemClickListener?) {
        this.listener = listener
    }

    inner class ViewHolder(private val binding: ItemHistoryBinding) : RecyclerView.ViewHolder(
        binding.root
    ) {
        fun onBind(position: Int) {
            val url = Uri.parse(list[position].url)
            binding.command.text = url.host
            val content = url.getQueryParameter("content")
            binding.urlPart.text = content
            val calendar = Calendar.getInstance()
            calendar.timeInMillis = list[position].timestamp
            val simpleDateFormat = SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.US)
            binding.timestamp.text = simpleDateFormat.format(calendar.time)
            itemView.setOnClickListener {
                if (listener != null) {
                    listener!!.onItemClick(position, url)
                }
            }
        }
    }

    interface OnItemClickListener {
        fun onItemClick(position: Int, item: Uri)
    }

    init {
        list = ArrayList()
    }
}