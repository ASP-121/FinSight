
package com.finsight.backend.util;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.Locale;

public final class CurrencyFormatter {

    private static final Locale INDIAN_LOCALE =
            Locale.forLanguageTag("en-IN");

    private CurrencyFormatter() {
    }

    public static String formatINR(BigDecimal amount) {

        NumberFormat formatter =
                NumberFormat.getCurrencyInstance(INDIAN_LOCALE);

        formatter.setMaximumFractionDigits(2);
        formatter.setMinimumFractionDigits(2);

        return formatter.format(
                amount == null ? BigDecimal.ZERO : amount
        );
    }
}
