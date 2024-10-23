package com.emenuapp_pk.ui.base.recycler;

import android.content.Context;
import android.graphics.Rect;
import android.view.View;

import androidx.annotation.DimenRes;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.GridLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

/**
 * Class for assigning offset to recycler view items
 */

@SuppressWarnings("WeakerAccess")
public class ItemOffsetDecoration extends RecyclerView.ItemDecoration {
    private final int spacing;
    private final int factor;
    private int displayMode;

    public static final int HORIZONTAL = 0;
    public static final int VERTICAL = 1;
    public static final int GRID = 2;

    /**
     * Generate offset decoration using spacing
     *
     * @param context
     * @param spacing between items
     */
    public ItemOffsetDecoration(Context context, @DimenRes int spacing) {
        this(context, spacing, -1, 1);
    }

    /**
     * Generate offset decoration using spacing and display mode
     *
     * @param context
     * @param spacing     between items
     * @param displayMode of recycler layout manager
     */
    public ItemOffsetDecoration(Context context, @DimenRes int spacing, int displayMode) {
        this(context, spacing, displayMode, 1);
    }

    /**
     * Generate offset decoration using spacing and display mode
     *
     * @param context
     * @param spacing     between items
     * @param displayMode of recycler layout manager
     * @param factor      margin of start and end element, only for horizontal
     *                    layout
     */
    public ItemOffsetDecoration(Context context, @DimenRes int spacing, int displayMode, int factor) {
        this.spacing = context.getResources().getDimensionPixelSize(spacing);
        this.displayMode = displayMode;
        this.factor = factor;
    }

    @Override
    public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent,
            @NonNull RecyclerView.State state) {
        int position = parent.getChildViewHolder(view).getAdapterPosition();
        int itemCount = state.getItemCount();
        RecyclerView.LayoutManager layoutManager = parent.getLayoutManager();
        setSpacingForDirection(outRect, layoutManager, position, itemCount);
    }

    /**
     * Calculate spacing
     *
     * @param outRect       output rectangle
     * @param layoutManager of recycler view
     * @param position      of item
     * @param itemCount     of recycler view
     */
    private void setSpacingForDirection(Rect outRect,
            RecyclerView.LayoutManager layoutManager,
            int position,
            int itemCount) {

        if (displayMode == -1) {
            displayMode = resolveDisplayMode(layoutManager);
        }

        switch (displayMode) {
            case HORIZONTAL:
                outRect.left = position == 0 ? spacing * factor : spacing;
                outRect.right = position == itemCount - 1 ? spacing * factor : 0;
                outRect.top = spacing;
                outRect.bottom = spacing;
                break;
            case VERTICAL:
                outRect.left = spacing;
                outRect.right = spacing;
                outRect.top = spacing;
                outRect.bottom = position == itemCount - 1 ? spacing : 0;
                break;
            case GRID:
                if (layoutManager instanceof GridLayoutManager) {
                    GridLayoutManager gridLayoutManager = (GridLayoutManager) layoutManager;
                    int cols = gridLayoutManager.getSpanCount();
                    int rows = Math.round((float) itemCount / cols);

                    outRect.left = spacing;
                    outRect.right = position % cols == cols - 1 ? spacing : 0;
                    outRect.top = spacing;
                    outRect.bottom = position / cols == rows - 1 ? spacing : 0;
                }
                break;
        }
    }

    private int resolveDisplayMode(RecyclerView.LayoutManager layoutManager) {
        if (layoutManager instanceof GridLayoutManager)
            return GRID;
        if (layoutManager.canScrollHorizontally())
            return HORIZONTAL;
        return VERTICAL;
    }
}