<?php

namespace App\Console\Commands;

use App\Services\CartService;
use Illuminate\Console\Command;

class CleanExpiredCarts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'carts:clean-expired 
                            {--minutes=1 : Minutos de antigüedad para considerar expirado}
                            {--delete-abandoned : Eliminar carritos abandonados antiguos (30+ días)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpiar carritos expirados y marcar como abandonados';

    protected $cartService;

    public function __construct(CartService $cartService)
    {
        parent::__construct();
        $this->cartService = $cartService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $minutes = (int) $this->option('minutes');
        
        $this->info("Limpiando carritos expirados (más de {$minutes} minuto(s))...");
        
        $cleaned = $this->cartService->cleanExpiredCarts($minutes);
        
        $this->info("✓ {$cleaned} carritos expirados limpiados y marcados como abandonados.");

        if ($this->option('delete-abandoned')) {
            $this->info("Eliminando carritos abandonados antiguos (30+ días)...");
            $deleted = $this->cartService->deleteOldAbandonedCarts(30);
            $this->info("✓ {$deleted} carritos abandonados eliminados permanentemente.");
        }

        return Command::SUCCESS;
    }
}
