/**
 * Curated Presets demonstrating PHP 8.4 features, legacy migration, and C++ performance
 */

import { PresetScript } from '../types/php';

export const PRESET_SCRIPTS: PresetScript[] = [
  {
    id: 'php84_property_hooks',
    title: 'PHP 8.4 Property Hooks & Asymmetric Visibility',
    titleUk: 'PHP 8.4: Property Hooks та Асиметрична Видимість',
    category: 'php84_features',
    description: 'Explore the revolutionary PHP 8.4 Property Hooks and asymmetric visibility (public private(set)), eliminating boilerplate getters and setters.',
    descriptionUk: 'Дослідіть нові Property Hooks у PHP 8.4 та асиметричну видимість (public private(set)), що усувають сотні рядків шаблонних геттерів/сеттерів.',
    sourceVersion: '8.4',
    code: `<?php
/**
 * PHP 8.4 Modern Class with Property Hooks & Asymmetric Visibility
 * Eliminates traditional boilerplate getters, setters, and validation logic
 */

class UserAccount {
    // PHP 8.4 Asymmetric Visibility: readable by anyone, writable only inside class
    public private(set) string $role = 'developer';
    public private(set) int $loginAttempts = 0;

    // Standard constructor promotion
    public function __construct(
        public string $firstName,
        public string $lastName,
        private string $emailAddress
    ) {}

    // PHP 8.4 Property Hook: Dynamic Computed Getter
    public string $fullName {
        get => "$this->firstName $this->lastName";
    }

    // PHP 8.4 Property Hook with Validation & Sanitization
    public string $username {
        get => strtolower($this->firstName . '.' . $this->lastName);
        set(string $value) => strtolower(trim($value));
    }

    public function promoteToAdmin(): void {
        $this->role = 'superadmin';
        echo "User {$this->fullName} elevated to {$this->role}\\n";
    }

    public function recordLogin(): void {
        $this->loginAttempts++;
    }
}

// Execution Sandbox
$user = new UserAccount('Oleksandr', 'Kovalenko', 'alex@example.ua');

echo "=== PHP 8.4 Native Runtime ===\\n";
echo "Full Name (Property Hook): " . $user->fullName . "\\n";
echo "Generated Username: " . $user->username . "\\n";
echo "Initial Role (public read): " . $user->role . "\\n";

$user->promoteToAdmin();
$user->recordLogin();
$user->recordLogin();

echo "Login attempts recorded: " . $user->loginAttempts . "\\n";
echo "PHP Engine Version: " . phpversion() . "\\n";
`,
  },

  {
    id: 'legacy_ecommerce_migration',
    title: 'Legacy PHP 5.6 Store -> Modern PHP 8.4',
    titleUk: 'Міграція застарілого магазину PHP 5.6 -> PHP 8.4',
    category: 'migration',
    description: 'An outdated PHP 5.6 script containing mysql_*, each(), old array() syntax, and legacy constructor ready to modernize to PHP 8.4 with 1-click.',
    descriptionUk: 'Застарілий скрипт PHP 5.6 з mysql_*, each(), старим синтаксисом array() та конструктором, готовий до автоматичної міграції в PHP 8.4.',
    sourceVersion: '5.6',
    code: `<?php
/**
 * LEGACY PHP 5.6 CODEBASE
 * Contains deprecated patterns, removed extensions, and insecure conventions
 */

class LegacyCart {
    var $items;
    var $total;

    // Outdated PHP 4-style constructor (Removed in PHP 8.0)
    function LegacyCart() {
        $this->items = array();
        $this->total = 0;
    }

    // Deprecated mysql_* query (Removed in PHP 7.0)
    function loadFromDatabase($cart_id) {
        $conn = mysql_connect("localhost", "root", "secret");
        mysql_select_db("shop", $conn);
        $result = mysql_query("SELECT * FROM cart_items WHERE cart_id = " . $cart_id);
        
        while ($row = mysql_fetch_assoc($result)) {
            $this->items[] = $row;
        }
    }

    function calculateTotal() {
        // Deprecated each() function in loop (Removed in PHP 8.0)
        reset($this->items);
        while (list($key, $item) = each($this->items)) {
            $this->total = $this->total + $item['price'];
        }
        return $this->total;
    }
}

// Sample Legacy Test Run
$cart = new LegacyCart();
$cart->items = array(
    array('name' => 'UltraBook Pro', 'price' => 1200),
    array('name' => 'Mechanical Keyboard', 'price' => 150),
    array('name' => 'Wireless Mouse', 'price' => 50)
);

$grandTotal = $cart->calculateTotal();
echo "Legacy Cart Total: $" . $grandTotal . "\\n";
`,
  },

  {
    id: 'high_performance_benchmark',
    title: 'High-Performance Math Benchmark (PHP vs C++)',
    titleUk: 'Бенчмарк продуктивності: PHP 8.4 проти C++23',
    category: 'benchmarks',
    description: 'Compute-intensive algorithm (Fibonacci & Matrix dot-product) measuring the immense performance leap when transpiled to native C++23.',
    descriptionUk: 'Інтенсивні обчислення (Фібоначчі та множення векторів) для наочного порівняння швидкості інтерпретатора PHP 8.4 та скомпільованого C++23.',
    sourceVersion: '8.4',
    code: `<?php
/**
 * Compute-Intensive Benchmark for PHP 8.4 vs Native C++23
 * Demonstrates CPU-bound throughput, loop optimization, and memory efficiency
 */

function iterativeFibonacci(int $n): int {
    if ($n <= 1) return $n;
    $prev = 0;
    $curr = 1;
    for ($i = 2; $i <= $n; $i++) {
        $next = $prev + $curr;
        $prev = $curr;
        $curr = $next;
    }
    return $curr;
}

function vectorDotProduct(array $a, array $b): float {
    $sum = 0.0;
    $len = count($a);
    for ($i = 0; $i < $len; $i++) {
        $sum += $a[$i] * $b[$i];
    }
    return $sum;
}

// Warmup and execution
$iterations = 50000;
$fibResult = iterativeFibonacci(50);

$vecA = [1.2, 2.4, 3.6, 4.8, 5.0, 6.2, 7.4, 8.6, 9.8, 10.0];
$vecB = [0.5, 1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5];

$totalDot = 0.0;
for ($iter = 0; $iter < $iterations; $iter++) {
    $totalDot += vectorDotProduct($vecA, $vecB);
}

echo "=== Benchmark Results ===\\n";
echo "Fibonacci(50): " . number_format($fibResult) . "\\n";
echo "Total Dot Product (" . number_format($iterations) . " iterations): " . number_format($totalDot, 2) . "\\n";
echo "Execution completed successfully!\\n";
`,
  },

  {
    id: 'php84_array_functions',
    title: 'PHP 8.4 New Array Primitives (array_find, all, any)',
    titleUk: 'PHP 8.4 Нові функції масивів (array_find, all, any)',
    category: 'php84_features',
    description: 'Use the newly added PHP 8.4 array functions that replace cumbersome foreach boilerplate.',
    descriptionUk: 'Використання нових нативних функцій масивів у PHP 8.4: array_find, array_all, array_any та array_find_key.',
    sourceVersion: '8.4',
    code: `<?php
/**
 * PHP 8.4 Native Array Helper Functions
 * Clean, expressive functional programming without third-party libraries
 */

$developers = [
    ['name' => 'Danylo', 'skill' => 'C++', 'experience' => 7, 'verified' => true],
    ['name' => 'Maria', 'skill' => 'PHP 8.4', 'experience' => 5, 'verified' => true],
    ['name' => 'Taras', 'skill' => 'Rust', 'experience' => 4, 'verified' => false],
    ['name' => 'Olena', 'skill' => 'Go', 'experience' => 8, 'verified' => true],
];

// PHP 8.4 array_find(): returns first matching element or null
$cppDev = array_find($developers, fn($dev) => $dev['skill'] === 'C++');
echo "Found C++ Engineer: " . $cppDev['name'] . " (" . $cppDev['experience'] . " yrs exp)\\n";

// PHP 8.4 array_all(): returns true if all items satisfy predicate
$allSenior = array_all($developers, fn($dev) => $dev['experience'] >= 3);
echo "Are all developers experienced (>= 3 yrs)? " . ($allSenior ? "YES" : "NO") . "\\n";

// PHP 8.4 array_any(): returns true if at least one item satisfies predicate
$hasPhp84 = array_any($developers, fn($dev) => $dev['skill'] === 'PHP 8.4');
echo "Is modern PHP 8.4 skill present? " . ($hasPhp84 ? "YES" : "NO") . "\\n";

// PHP 8.0+ Match expression for skill level categorization
$level = match (true) {
    $cppDev['experience'] >= 10 => 'Principal Architect',
    $cppDev['experience'] >= 5  => 'Senior Staff Engineer',
    default                     => 'Software Engineer',
};

echo "Engineer Rank: " . $level . "\\n";
`,
  },
];
