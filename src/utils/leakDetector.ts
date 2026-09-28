import { Transaction, MoneyLeak, Category } from '../types/finance';

export function analyzeMoneyLeaks(
  transactions: Transaction[],
  categories: Category[]
): MoneyLeak[] {
  const leaks: MoneyLeak[] = [];
  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthProgress = currentDay / daysInMonth;

  // 1. Zombie Subscriptions
  const subscriptionTxs = transactions.filter(t => t.type === 'expense' && (t.isSubscription || t.categoryId === 'cat-subscriptions'));
  const zombieSubs = subscriptionTxs.filter(t => (t.regretRating && t.regretRating >= 4) || t.leakFlags?.includes('zombie_subscription'));
  
  if (zombieSubs.length > 0) {
    const monthlySum = zombieSubs.reduce((acc, t) => acc + t.amount, 0);
    const subNames = Array.from(new Set(zombieSubs.map(t => t.title))).join(', ');
    leaks.push({
      id: 'leak-zombie-subs',
      title: 'Zombie Subscriptions Detected',
      type: 'zombie_subscription',
      severity: 'high',
      estimatedMonthlyLoss: monthlySum,
      estimatedYearlyLoss: monthlySum * 12,
      description: `You have ${zombieSubs.length} recurring subscription(s) flagged with low utility or high regret (${subNames}). These auto-renew silently every month.`,
      recommendation: 'Cancel or pause these subscriptions immediately. Set calendar reminders before free trials convert.',
      actionText: 'Review Subscriptions',
      affectedTransactionsCount: zombieSubs.length,
      savingsPotentialBadge: `Save $${(monthlySum * 12).toFixed(0)}/yr`
    });
  }

  // 2. Micro-Spending / Death by 1000 Cuts (Small repeat purchases < $15)
  const microTxs = transactions.filter(t => t.type === 'expense' && t.amount <= 15 && t.categoryId !== 'cat-groceries');
  // Group by title
  const titleCounts: Record<string, { count: number; total: number; title: string }> = {};
  microTxs.forEach(t => {
    const key = t.title.toLowerCase().trim();
    if (!titleCounts[key]) {
      titleCounts[key] = { count: 0, total: 0, title: t.title };
    }
    titleCounts[key].count += 1;
    titleCounts[key].total += t.amount;
  });

  const frequentMicro = Object.values(titleCounts).filter(item => item.count >= 2);
  const totalMicroLoss = microTxs.reduce((acc, t) => acc + t.amount, 0);

  if (microTxs.length >= 3) {
    leaks.push({
      id: 'leak-micro-spending',
      title: 'Micro-Spending Drain ("Death by $7 Cuts")',
      type: 'micro_spending',
      severity: 'medium',
      estimatedMonthlyLoss: totalMicroLoss * (30 / Math.max(currentDay, 10)),
      estimatedYearlyLoss: totalMicroLoss * 12,
      description: `Identified ${microTxs.length} small transactions (<$15) totaling $${totalMicroLoss.toFixed(2)}. Frequent purchases like daily cafe drinks or quick convenience runs silently erode your monthly surplus.`,
      recommendation: 'Implement a weekly cash allowance for small treats or prepare cold brew/snacks at home 3 days a week.',
      actionText: 'Cap Daily Micro-Spend',
      affectedTransactionsCount: microTxs.length,
      savingsPotentialBadge: `Save $${(totalMicroLoss * 12).toFixed(0)}/yr`
    });
  }

  // 3. Convenience, Delivery & ATM Fees
  const feeTxs = transactions.filter(t => 
    t.type === 'expense' && 
    (t.isConvenienceFee || t.categoryId === 'cat-fees' || t.leakFlags?.includes('convenience_fee'))
  );
  if (feeTxs.length > 0) {
    const feeSum = feeTxs.reduce((acc, t) => acc + t.amount, 0);
    leaks.push({
      id: 'leak-convenience-fees',
      title: 'Vampire Delivery & Out-of-Network Fees',
      type: 'convenience_fee',
      severity: feeSum > 20 ? 'high' : 'medium',
      estimatedMonthlyLoss: feeSum,
      estimatedYearlyLoss: feeSum * 12,
      description: `You paid $${feeSum.toFixed(2)} in platform service fees, delivery markups, and ATM surcharges. These are 100% pure financial friction.`,
      recommendation: 'Use in-network bank ATMs and switch from delivery apps to direct restaurant pickup or weekly grocery meal prep.',
      actionText: 'Eliminate Fees',
      affectedTransactionsCount: feeTxs.length,
      savingsPotentialBadge: `Save $${(feeSum * 12).toFixed(0)}/yr`
    });
  }

  // 4. Impulse & Buyer\'s Remorse (Regret Rating >= 4 or isImpulse)
  const impulseTxs = transactions.filter(t => t.type === 'expense' && (t.isImpulse || (t.regretRating && t.regretRating >= 4)));
  if (impulseTxs.length > 0) {
    const impulseSum = impulseTxs.reduce((acc, t) => acc + t.amount, 0);
    leaks.push({
      id: 'leak-impulse-regret',
      title: 'Impulse Buying & Post-Purchase Regret',
      type: 'impulse_regret',
      severity: impulseSum > 100 ? 'critical' : 'high',
      estimatedMonthlyLoss: impulseSum,
      estimatedYearlyLoss: impulseSum * 12,
      description: `$${impulseSum.toFixed(2)} spent on ${impulseTxs.length} impulse purchases where you reported high regret or emotional late-night buying.`,
      recommendation: 'Adopt the "48-Hour Wishlist Rule": Wait 48 hours before purchasing any non-essential item over $30.',
      actionText: 'Enable 48h Cooling Buffer',
      affectedTransactionsCount: impulseTxs.length,
      savingsPotentialBadge: `Recover $${(impulseSum * 12).toFixed(0)}/yr`
    });
  }

  // 5. Price Creep on Subscriptions
  const priceCreepTxs = transactions.filter(t => t.leakFlags?.includes('price_creep'));
  if (priceCreepTxs.length > 0) {
    const creepSum = priceCreepTxs.reduce((acc, t) => acc + t.amount, 0);
    leaks.push({
      id: 'leak-price-creep',
      title: 'Silent Subscription Price Hikes',
      type: 'price_creep',
      severity: 'medium',
      estimatedMonthlyLoss: creepSum,
      estimatedYearlyLoss: creepSum * 12,
      description: `Companies like streaming apps and cloud software silently raised plan prices. You have ${priceCreepTxs.length} plan(s) with increased billing rates.`,
      recommendation: 'Downgrade to ad-supported/basic tiers, share family plans, or rotate subscriptions one month at a time.',
      actionText: 'Audit Subscriptions',
      affectedTransactionsCount: priceCreepTxs.length,
      savingsPotentialBadge: `Save $${(creepSum * 12).toFixed(0)}/yr`
    });
  }

  // 6. Category Budget Burn Rate Overheat
  categories.forEach(cat => {
    if (cat.monthlyBudget && cat.monthlyBudget > 0 && cat.group === 'wants') {
      const catSpend = transactions
        .filter(t => t.type === 'expense' && t.categoryId === cat.id)
        .reduce((sum, t) => sum + t.amount, 0);

      const spendRatio = catSpend / cat.monthlyBudget;
      if (spendRatio > 0.8 && monthProgress < 0.6) {
        const projectedOverspend = (catSpend / Math.max(monthProgress, 0.1)) - cat.monthlyBudget;
        leaks.push({
          id: `leak-burn-${cat.id}`,
          title: `${cat.name} Burn Rate Warning`,
          type: 'budget_burn',
          severity: 'high',
          estimatedMonthlyLoss: Math.max(projectedOverspend, 50),
          estimatedYearlyLoss: Math.max(projectedOverspend, 50) * 12,
          categoryName: cat.name,
          description: `You have consumed ${(spendRatio * 100).toFixed(0)}% ($${catSpend.toFixed(0)}) of your $${cat.monthlyBudget} monthly budget, but only ${(monthProgress * 100).toFixed(0)}% of the month has passed.`,
          recommendation: `Slow down spending in ${cat.name} or temporarily transfer funds from your Guilt-Free bucket.`,
          actionText: 'Adjust Category Cap',
          savingsPotentialBadge: `Prevent $${Math.max(projectedOverspend, 50).toFixed(0)} Overspend`
        });
      }
    }
  });

  return leaks;
}
