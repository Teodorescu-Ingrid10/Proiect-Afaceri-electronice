import { useEffect, useState } from 'react';
import { fetchWishlist, deleteWishlistItem, updateWishlistItem } from '../api/wish.routes';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import LoadingSpinner from '../components/LoadingSpinner';
import axiosNoAuth from "../axios/axiosNoAuth";

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const user = useSelector((state) => state.user.user);
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        setLoading(true);
        const raw = await fetchWishlist(); // may be { data: [...] } or { wishlist: [...] } or [...]
        const items = raw?.data ?? raw?.wishlist ?? raw ?? [];
        console.log('RAW WISHLIST RESPONSE', raw);

        // If backend already returns product object inside each wishlist item
        if (items.length > 0 && items[0].product) {
          setWishlistItems(items);
          return;
        }

        // Otherwise, items likely contain productId — fetch products and map them
        const productIds = items.map((it) => it.productId ?? it.product_id ?? it.product?.id).filter(Boolean);
        if (productIds.length === 0) {
          // fallback: keep items but ensure product is null to avoid crashes
          setWishlistItems(items.map(it => ({ ...it, product: null })));
          return;
        }

        // Fetch all products once and build a map (more efficient than N requests)
        const productsResp = await axiosNoAuth.get('products');
        const productsList = productsResp.data?.data ?? productsResp.data ?? [];
        const byId = Object.fromEntries(productsList.map(p => [p.id ?? p._id, p]));

        const enriched = items.map(it => {
          const pid = it.productId ?? it.product_id ?? it.product?.id;
          return { ...it, product: byId[pid] ?? null };
        });

        setWishlistItems(enriched);
      } catch (err) {
        console.error('Error fetching wishlist or products:', err);
        setError(err.message || 'An error occurred while fetching wishlist');
      } finally {
        setLoading(false);
      }
    };
    loadWishlist();
  }, []);

  const handleEditClick = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleRemoveClick = async (wishlistId, productId) => {
    const confirmed = confirm('Are you sure you want to remove this item from your wishlist?');
    if (!confirmed) return;

    try {
      setDeletingId(wishlistId);
      const response = await deleteWishlistItem(wishlistId);

      if (response?.success) {
        setWishlistItems(wishlistItems.filter((item) => item.id !== wishlistId));
        toast.success('Removed from wishlist');
      } else {
        toast.error(response?.message || 'Failed to remove from wishlist');
      }
    } catch (err) {
      toast.error(err.message || 'An error occurred while removing the item');
    } finally {
      setDeletingId(null);
    }
  };

  const handleOpenEditNotes = (item) => {
    setEditingId(item.id);
    setEditNotes(item.notes || '');
  };

  const handleSaveNotes = async () => {
    try {
      const response = await updateWishlistItem(editingId, { notes: editNotes });
      if (response?.success) {
        setWishlistItems(wishlistItems.map(item =>
          item.id === editingId ? { ...item, notes: editNotes } : item
        ));
        toast.success('Notes updated');
        setEditingId(null);
      } else {
        toast.error(response?.message || 'Failed to update notes');
      }
    } catch (err) {
      toast.error(err.message || 'Error updating notes');
    }
  };

  const handleCloseModal = () => {
    setEditingId(null);
    setEditNotes('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

return (
    <div className="bg-white h-screen overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">My Wishlist</h2>

        <div className="space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              {/* Product Image */}
              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32">
                <img
                  alt={item.product?.name || 'Product'}
                  src={item.product?.image || 'https://via.placeholder.com/150'}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>

              {/* Product Info */}
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {item.product?.name || 'Unknown Product'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{item.product?.category || 'N/A'}</p>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {item.product?.description || 'No description available'}
                </p>
                {/* Personal notes from wishlist */}
                {item.notes ? (
                  <p className="text-sm text-gray-700 mt-2">
                    <span className="font-semibold">Personal notes:</span> {item.notes}
                  </p>
                ) : (
                  <p className="text-sm text-gray-400 mt-2">Personal notes: None</p>
                )}

                <p className="text-lg font-bold text-gray-900 mt-3">
                  ${item.product?.price || '0.00'}
                </p>
              </div>

              {/* Action Buttons */}
              {/* Action Buttons */}
              <div className="flex flex-col gap-2 justify-center items-end flex-shrink-0">
                <button
                  type="button"
                  className="p-2 rounded-full transition-colors duration-200"
                  onClick={() => handleRemoveClick(item.id, item.product?.id)}
                  title="Remove from wishlist"
                  style={{ backgroundColor: '#dc2626' }}
                >
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </button>

                {isAdmin && (
                  <button
                    type="button"
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md shadow-lg transition-colors duration-200"
                    onClick={() => handleEditClick(item.product?.id)}
                    title="Edit product"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-md text-sm font-semibold transition-colors duration-200"
                  onClick={() => handleOpenEditNotes(item)}
                  title="Edit notes"
                >
                  Edit Notes
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Notes Modal */}
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Personal Notes</h3>
            <textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              placeholder="Add your personal notes here..."
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              rows="4"
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}