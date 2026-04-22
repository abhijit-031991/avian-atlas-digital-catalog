import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Pencil, Trash2, Plus, X, Layers } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useDeployments } from '@/hooks/useDeployments';
import { Deployment } from '@/types/deployments';
import { DeviceInfo } from '@/types/database-analytics';
import { useToast } from '@/hooks/use-toast';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  device: DeviceInfo;
}

// ── Blank form state ──────────────────────────────────────────────────────────

const blank = () => ({
  name: '',
  startDate: undefined as Date | undefined,
  endDate: undefined as Date | undefined,
  notes: '',
});

// ── Date picker button ────────────────────────────────────────────────────────

const DatePickerButton = ({
  value, onChange, placeholder,
}: {
  value?: Date; onChange: (d: Date | undefined) => void; placeholder: string;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <button
        className={[
          'flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs transition-colors w-full',
          value
            ? 'border-primary/40 bg-primary/5 text-foreground'
            : 'border-border bg-background text-muted-foreground hover:bg-muted/50',
        ].join(' ')}
      >
        <CalendarIcon className="h-3 w-3 shrink-0" />
        {value ? format(value, 'dd MMM yyyy') : placeholder}
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-auto p-0" align="start">
      <Calendar
        mode="single"
        selected={value}
        onSelect={onChange}
        initialFocus
      />
    </PopoverContent>
  </Popover>
);

// ── Deployment row ────────────────────────────────────────────────────────────

const DeploymentRow = ({
  deployment,
  onEdit,
  onDelete,
}: {
  deployment: Deployment;
  onEdit: (d: Deployment) => void;
  onDelete: (id: string) => void;
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const start = parseISO(deployment.startDate);
  const end   = deployment.endDate ? parseISO(deployment.endDate) : null;
  const days  = end ? differenceInDays(end, start) : null;

  return (
    <>
      <div className="flex items-start gap-3 px-4 py-3 border border-border rounded-lg bg-card">
        {/* Colour bar */}
        <div className="w-1 self-stretch rounded-full bg-primary/50 shrink-0 mt-0.5" />

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{deployment.name}</p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            {format(start, 'dd MMM yyyy')}
            {' → '}
            {end ? format(end, 'dd MMM yyyy') : <span className="text-emerald-500">Ongoing</span>}
            {days != null && (
              <span className="ml-2 text-muted-foreground/50">({days}d)</span>
            )}
          </p>
          {deployment.notes && (
            <p className="text-xs text-muted-foreground/60 mt-1 truncate">{deployment.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(deployment)}
            className="p-1.5 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete deployment?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deployment.name}" will be permanently deleted. The underlying data is unaffected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => onDelete(deployment.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// ── Main dialog ───────────────────────────────────────────────────────────────

const ManageDeploymentsDialog = ({ open, onOpenChange, device }: Props) => {
  const { deployments, loading, createDeployment, updateDeployment, deleteDeployment } =
    useDeployments(device.id);
  const { toast } = useToast();

  const [form, setForm]           = useState(blank());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);
  const [showForm, setShowForm]   = useState(false);

  const resetForm = () => {
    setForm(blank());
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (d: Deployment) => {
    setForm({
      name:      d.name,
      startDate: parseISO(d.startDate),
      endDate:   d.endDate ? parseISO(d.endDate) : undefined,
      notes:     d.notes ?? '',
    });
    setEditingId(d.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim())  return toast({ title: 'Name is required',       variant: 'destructive' });
    if (!form.startDate)    return toast({ title: 'Start date is required',  variant: 'destructive' });
    if (form.endDate && form.endDate < form.startDate)
      return toast({ title: 'End date must be after start date', variant: 'destructive' });

    setSaving(true);
    try {
      const trimmedNotes = form.notes.trim();
      const payload = {
        name:      form.name.trim(),
        startDate: form.startDate.toISOString(),
        endDate:   form.endDate ? form.endDate.toISOString() : null,
        ...(trimmedNotes ? { notes: trimmedNotes } : {}),
      };
      if (editingId) {
        await updateDeployment(editingId, payload);
        toast({ title: 'Deployment updated' });
      } else {
        await createDeployment(payload);
        toast({ title: 'Deployment created' });
      }
      resetForm();
    } catch {
      toast({ title: 'Failed to save deployment', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDeployment(id);
      toast({ title: 'Deployment deleted' });
    } catch {
      toast({ title: 'Failed to delete', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetForm(); }}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-5 pt-5 pb-4 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Layers className="h-4 w-4 text-primary" />
            Deployments
            <span className="font-mono text-primary text-sm">· {device.id}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Deployment list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2 min-h-0">
          {loading ? (
            <div className="space-y-2">
              {[1, 2].map(i => <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />)}
            </div>
          ) : deployments.length === 0 ? (
            <div className="text-center py-10">
              <Layers className="h-8 w-8 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">No deployments yet</p>
              <p className="text-xs text-muted-foreground/50 mt-1">
                Create one to tag a date range with an animal or subject name.
              </p>
            </div>
          ) : (
            deployments.map(d => (
              <DeploymentRow
                key={d.id}
                deployment={d}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Form */}
        <div className="border-t border-border px-5 py-4 shrink-0 bg-muted/20">
          {!showForm ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-3.5 w-3.5" />
              New Deployment
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  {editingId ? 'Edit Deployment' : 'New Deployment'}
                </p>
                <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Name */}
              <Input
                placeholder="Animal / subject name (e.g. Leopard M01)"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="h-8 text-sm"
              />

              {/* Date range */}
              <div className="grid grid-cols-2 gap-2">
                <DatePickerButton
                  value={form.startDate}
                  onChange={d => setForm(p => ({ ...p, startDate: d }))}
                  placeholder="Start date"
                />
                <DatePickerButton
                  value={form.endDate}
                  onChange={d => setForm(p => ({ ...p, endDate: d }))}
                  placeholder="End date (optional)"
                />
              </div>

              {/* Notes */}
              <Input
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                className="h-8 text-sm"
              />

              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? 'Saving…' : editingId ? 'Update' : 'Create'}
                </Button>
                <Button size="sm" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManageDeploymentsDialog;
