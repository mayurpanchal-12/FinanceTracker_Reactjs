  const handleSubmit = async (e) => {
    e.preventDefault();
    const amt = Number(amount);
    const trimmedInfo = info.trim();
    if (!date || !trimmedInfo || Number.isNaN(amt) || amt <= 0) {
      toast.error("Please enter a positive amount and fill all fields.");
      return;
    }

    if (editingId !== null) {
      // ── edit mode ──────────────────────────────────────
      const today = new Date().toISOString().slice(0, 10);
      const isScheduled = scheduledPage && date > today;
      const updateData = {
        date,
        amount: amt,
        info: trimmedInfo,
        type,
        category,
        highlighted: highlightActive,
        note: note.trim() || undefined,
      };
      if (isScheduled) {
        updateData.isScheduled = true;
        updateData.scheduledDate = date;
      } else if (transactionToEdit?.isScheduled) {
        updateData.isScheduled = false;
        updateData.scheduledDate = undefined;
      }
      updateTransaction(editingId, updateData);
      clearForm();
    } else {
      // ── add mode ───────────────────────────────────────
      // 1. upload receipt first if selected
      let receiptUrl = undefined;
      if (receiptFile && user) {
        setUploadingReceipt(true);
        try {
          // pass null as txId — we don't have it yet, vault saves it anyway
          const saved = await uploadReceipt(user.uid, receiptFile, null);
          receiptUrl = saved.url;
        } catch {
          toast.error(
            "Receipt upload failed — transaction saved without receipt.",
          );
        } finally {
          setUploadingReceipt(false);
        }
      }

      // 2. add transaction with receiptUrl if available
      addTransaction(
        {
          date,
          amount: amt,
          info: trimmedInfo,
          type,
          category,
          highlighted: highlightActive,
          note: note.trim() || undefined,
          ...(receiptUrl && { receiptUrl }), // only add if receipt uploaded
        },
        { scheduledWhenFuture: scheduledPage },
      );

      // 3. reset form
      setAmount("");
      setInfo("");
      setNote("");
      setNoteVisible(false);
      setReceiptFile(null);
      setReceiptPreview(null);
      if (receiptInputRef.current) receiptInputRef.current.value = "";
    }
  };