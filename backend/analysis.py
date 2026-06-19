import pandas as pd
import os

def get_data():
    try:
        uploads_folder = "uploads"

        files = [
            os.path.join(uploads_folder, f)
            for f in os.listdir(uploads_folder)
            if f.endswith((".csv", ".xlsx", ".xls"))
        ]

        if not files:
            return {"error": "No file uploaded"}

        latest_file = max(files, key=os.path.getmtime)

        if latest_file.endswith(".csv"):
            df = pd.read_csv(latest_file)
        else:
            df = pd.read_excel(latest_file)

        total_rows = len(df)
        total_columns = len(df.columns)

        numeric_cols = df.select_dtypes(include="number").columns.tolist()
        categorical_cols = df.select_dtypes(include="object").columns.tolist()

        missing_values = int(df.isnull().sum().sum())

        kpis = {
            "rows": total_rows,
            "columns": total_columns,
            "numericColumns": len(numeric_cols),
            "missingValues": missing_values
        }

        bar_chart = []
        if len(categorical_cols) > 0 and len(numeric_cols) > 0:
            cat_col = categorical_cols[0]
            num_col = numeric_cols[0]

            bar_df = (
                df.groupby(cat_col)[num_col]
                .sum()
                .reset_index()
                .head(10)
            )

            bar_chart = bar_df.to_dict(orient="records")

        pie_chart = []
        if len(categorical_cols) > 0 and len(numeric_cols) > 0:
            cat_col = categorical_cols[0]
            num_col = numeric_cols[0]

            pie_df = (
                df.groupby(cat_col)[num_col]
                .sum()
                .reset_index()
                .head(5)
            )

            pie_chart = pie_df.to_dict(orient="records")

        line_chart = []
        if len(numeric_cols) >= 2:
            x_col = numeric_cols[0]
            y_col = numeric_cols[1]

            line_df = df[[x_col, y_col]].head(20)

            line_chart = line_df.to_dict(orient="records")

        insights = [
            f"Dataset contains {total_rows} rows",
            f"Dataset contains {total_columns} columns",
            f"Numeric columns found: {len(numeric_cols)}",
            f"Missing values found: {missing_values}"
        ]

        return {
            "kpis": kpis,
            "barChart": bar_chart,
            "pieChart": pie_chart,
            "lineChart": line_chart,
            "insights": insights
        }

    except Exception as e:
        return {"error": str(e)}