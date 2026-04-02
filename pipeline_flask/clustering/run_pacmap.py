import pacmap

embedding = pacmap.PaCMAP(n_components=2, MN_ratio=0.5, FP_ratio=2.0) 

def run_pacmap(data):
    transformed = embedding.fit_transform(data, init="pca")
    transformed = transformed.tolist()
    return transformed
