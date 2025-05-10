USE [Fuego]
GO
/****** Object:  Table [dbo].[__EFMigrationsHistory]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__EFMigrationsHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoleClaims]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoleClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[NormalizedName] [nvarchar](256) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](450) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](450) NOT NULL,
	[ProviderKey] [nvarchar](450) NOT NULL,
	[ProviderDisplayName] [nvarchar](max) NULL,
	[UserId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](450) NOT NULL,
	[RoleId] [nvarchar](450) NOT NULL,
 CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](450) NOT NULL,
	[UserName] [nvarchar](256) NULL,
	[NormalizedUserName] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[NormalizedEmail] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[ConcurrencyStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEnd] [datetimeoffset](7) NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
 CONSTRAINT [PK_AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserTokens]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserTokens](
	[UserId] [nvarchar](450) NOT NULL,
	[LoginProvider] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](450) NOT NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[LoginProvider] ASC,
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblAppContent]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblAppContent](
	[Id] [uniqueidentifier] NOT NULL,
	[SeoTitle] [nvarchar](max) NULL,
	[SeoKeys] [nvarchar](max) NULL,
	[ContentType] [nvarchar](max) NULL,
	[URL] [nvarchar](max) NULL,
	[SeoDescription] [nvarchar](max) NULL,
	[AboutTitle] [nvarchar](max) NULL,
	[AboutDescription] [nvarchar](max) NULL,
	[Imprint] [nvarchar](max) NULL,
	[DataProtection] [nvarchar](max) NULL,
	[CookiePolicy] [nvarchar](max) NULL,
	[ShopSectionDescription] [nvarchar](max) NULL,
	[ShopSectionTitle] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblAppContent] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblArticles]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblArticles](
	[Id] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[Content] [nvarchar](max) NULL,
	[URL] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
	[Date] [datetime2](7) NOT NULL,
	[TagIds] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblArticles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblArticleTag]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblArticleTag](
	[ArticleId] [uniqueidentifier] NOT NULL,
	[TagId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_tblArticleTag] PRIMARY KEY CLUSTERED 
(
	[ArticleId] ASC,
	[TagId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCarousels]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCarousels](
	[Id] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[SubTitle] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblCarousels] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCategories]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCategories](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblCategories] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblCBDShops]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblCBDShops](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[ProfileUrl] [nvarchar](max) NULL,
	[Phone] [nvarchar](max) NULL,
	[IsVerified] [bit] NOT NULL,
	[Email] [nvarchar](max) NULL,
	[Address] [nvarchar](max) NULL,
	[Lat] [real] NOT NULL,
	[Long] [real] NOT NULL,
	[Price] [real] NOT NULL,
	[StartDay] [nvarchar](max) NULL,
	[EndDay] [nvarchar](max) NULL,
	[StartTime] [time](7) NOT NULL,
	[EndTime] [time](7) NOT NULL,
	[ImagePath] [nvarchar](max) NULL,
	[CoverImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblCBDShops] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblDoctors]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblDoctors](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[ProfileUrl] [nvarchar](max) NULL,
	[Phone] [nvarchar](max) NULL,
	[IsVerified] [bit] NOT NULL,
	[Email] [nvarchar](max) NULL,
	[Address] [nvarchar](max) NULL,
	[Lat] [real] NOT NULL,
	[Long] [real] NOT NULL,
	[Price] [real] NOT NULL,
	[StartDay] [nvarchar](max) NULL,
	[EndDay] [nvarchar](max) NULL,
	[StartTime] [time](7) NOT NULL,
	[EndTime] [time](7) NOT NULL,
	[ImagePath] [nvarchar](max) NULL,
	[CoverImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblDoctors] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblEffects]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblEffects](
	[Id] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblEffects] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblFeedbacks]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblFeedbacks](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
	[Email] [nvarchar](max) NULL,
	[Phone] [nvarchar](max) NULL,
	[Subject] [nvarchar](max) NULL,
	[Comment] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblFeedbacks] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblGrowEquipments]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblGrowEquipments](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[ProfileUrl] [nvarchar](max) NULL,
	[Phone] [nvarchar](max) NULL,
	[IsVerified] [bit] NOT NULL,
	[Email] [nvarchar](max) NULL,
	[Address] [nvarchar](max) NULL,
	[Lat] [real] NOT NULL,
	[Long] [real] NOT NULL,
	[Price] [real] NOT NULL,
	[StartDay] [nvarchar](max) NULL,
	[EndDay] [nvarchar](max) NULL,
	[StartTime] [time](7) NOT NULL,
	[EndTime] [time](7) NOT NULL,
	[ImagePath] [nvarchar](max) NULL,
	[CoverImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblGrowEquipments] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblHeadShops]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblHeadShops](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[ProfileUrl] [nvarchar](max) NULL,
	[Phone] [nvarchar](max) NULL,
	[IsVerified] [bit] NOT NULL,
	[Email] [nvarchar](max) NULL,
	[Address] [nvarchar](max) NULL,
	[Lat] [real] NOT NULL,
	[Long] [real] NOT NULL,
	[Price] [real] NOT NULL,
	[StartDay] [nvarchar](max) NULL,
	[EndDay] [nvarchar](max) NULL,
	[StartTime] [time](7) NOT NULL,
	[EndTime] [time](7) NOT NULL,
	[ImagePath] [nvarchar](max) NULL,
	[CoverImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblHeadShops] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblLanguages]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblLanguages](
	[Culture] [nvarchar](450) NOT NULL,
	[Name] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblLanguages] PRIMARY KEY CLUSTERED 
(
	[Culture] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblManufacturers]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblManufacturers](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblManufacturers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblMenus]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblMenus](
	[Id] [uniqueidentifier] NOT NULL,
	[CategoryId] [uniqueidentifier] NOT NULL,
	[TitleInEn] [nvarchar](max) NULL,
	[TitleInDe] [nvarchar](max) NULL,
	[DescriptionInEn] [nvarchar](max) NULL,
	[DescriptionInDe] [nvarchar](max) NULL,
	[Price] [nvarchar](max) NULL,
	[Quantity] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblMenus] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblNewsLetters]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblNewsLetters](
	[Id] [uniqueidentifier] NOT NULL,
	[Email] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblNewsLetters] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblOrigins]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblOrigins](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblOrigins] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblPartnerLogos]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblPartnerLogos](
	[Id] [uniqueidentifier] NOT NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblPartnerLogos] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblPharmacies]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblPharmacies](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[ProfileUrl] [nvarchar](max) NULL,
	[Phone] [nvarchar](max) NULL,
	[IsVerified] [bit] NOT NULL,
	[Email] [nvarchar](max) NULL,
	[Address] [nvarchar](max) NULL,
	[Lat] [real] NOT NULL,
	[Long] [real] NOT NULL,
	[Price] [real] NOT NULL,
	[StartDay] [nvarchar](max) NULL,
	[EndDay] [nvarchar](max) NULL,
	[StartTime] [time](7) NOT NULL,
	[EndTime] [time](7) NOT NULL,
	[ImagePath] [nvarchar](max) NULL,
	[CoverImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblPharmacies] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblProductEffect]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblProductEffect](
	[ProductId] [uniqueidentifier] NOT NULL,
	[EffectId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_tblProductEffect] PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC,
	[EffectId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblProductPharmacies]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblProductPharmacies](
	[ProductId] [uniqueidentifier] NOT NULL,
	[PharmacyId] [uniqueidentifier] NOT NULL,
	[Price] [real] NOT NULL,
 CONSTRAINT [PK_tblProductPharmacies] PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC,
	[PharmacyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblProducts]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblProducts](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
	[SaleName] [nvarchar](max) NULL,
	[Genetics] [nvarchar](max) NULL,
	[Rating] [int] NOT NULL,
	[CBD] [int] NOT NULL,
	[THC] [int] NOT NULL,
	[Price] [real] NOT NULL,
	[IsAvailable] [nvarchar](max) NULL,
	[OriginId] [uniqueidentifier] NULL,
	[ManufacturerId] [uniqueidentifier] NULL,
	[ImagePath] [nvarchar](max) NULL,
	[FeaturedProduct] [nvarchar](max) NULL,
	[RayId] [uniqueidentifier] NULL,
	[AboutFlower] [nvarchar](max) NULL,
	[GrowerDescription] [nvarchar](max) NULL,
	[DefaultImageIndex] [int] NOT NULL,
 CONSTRAINT [PK_tblProducts] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblProductStrain]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblProductStrain](
	[ProductId] [uniqueidentifier] NOT NULL,
	[StrainId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_tblProductStrain] PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC,
	[StrainId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblProductTaste]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblProductTaste](
	[ProductId] [uniqueidentifier] NOT NULL,
	[TasteId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_tblProductTaste] PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC,
	[TasteId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblProductTerpene]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblProductTerpene](
	[ProductId] [uniqueidentifier] NOT NULL,
	[TerpeneId] [uniqueidentifier] NOT NULL,
 CONSTRAINT [PK_tblProductTerpene] PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC,
	[TerpeneId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblRays]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblRays](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblRays] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblShopDescriptions]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblShopDescriptions](
	[Id] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[Description] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblShopDescriptions] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblStrains]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblStrains](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblStrains] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblStringResources]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblStringResources](
	[Id] [uniqueidentifier] NOT NULL,
	[LanguageId] [nvarchar](450) NULL,
	[Name] [nvarchar](max) NULL,
	[Value] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblStringResources] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblTags]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblTags](
	[Id] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblTags] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblTastes]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblTastes](
	[Id] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblTastes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tblTerpenes]    Script Date: 3/12/2025 12:16:43 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tblTerpenes](
	[Id] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](max) NULL,
	[ImagePath] [nvarchar](max) NULL,
 CONSTRAINT [PK_tblTerpenes] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20241231150936_Initial', N'9.0.0')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20250102233949_tblShopDescriptions_Added', N'9.0.0')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20250123141127_Pharmacy_Product_Relation', N'9.0.0')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20250123232636_Nullable_Fields', N'9.0.0')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20250204193514_tblRays_Added', N'9.0.0')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20250206191848_ProductFields_Added', N'9.0.0')
GO
INSERT [dbo].[__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES (N'20250207194706_ImageOrder', N'9.0.0')
GO
INSERT [dbo].[AspNetRoles] ([Id], [Name], [NormalizedName], [ConcurrencyStamp]) VALUES (N'2f1e2873-fdbe-4389-861a-42eed5662e50', N'Admin', N'ADMIN', NULL)
GO
INSERT [dbo].[AspNetUserRoles] ([UserId], [RoleId]) VALUES (N'6c357211-0cfa-47de-ae80-acc6e3ff86e5', N'2f1e2873-fdbe-4389-861a-42eed5662e50')
GO
INSERT [dbo].[AspNetUsers] ([Id], [UserName], [NormalizedUserName], [Email], [NormalizedEmail], [EmailConfirmed], [PasswordHash], [SecurityStamp], [ConcurrencyStamp], [PhoneNumber], [PhoneNumberConfirmed], [TwoFactorEnabled], [LockoutEnd], [LockoutEnabled], [AccessFailedCount]) VALUES (N'6c357211-0cfa-47de-ae80-acc6e3ff86e5', N'admin', N'ADMIN', N'admin@demo.com', N'ADMIN@DEMO.COM', 1, N'AQAAAAIAAYagAAAAEJzvc7R19zBUsrWekyOdSYvulLsN8x25glAx5l1dGDf7BXWU9H8I+/7A8JBp0jclQg==', N'FRVB76XV4NQEIQTTLJDMAMEJKOMORQJ2', N'ffeed79b-1323-4360-9479-53b6b83db795', NULL, 0, 0, NULL, 1, 0)
GO
INSERT [dbo].[tblAppContent] ([Id], [SeoTitle], [SeoKeys], [ContentType], [URL], [SeoDescription], [AboutTitle], [AboutDescription], [Imprint], [DataProtection], [CookiePolicy], [ShopSectionDescription], [ShopSectionTitle]) VALUES (N'01942201-1c7e-7381-8a07-50fea9007d01', N'Dignissimos aliquip ', N'Velit dignissimos ei', NULL, N'Id expedita molestia', N'Molestiae tempor mai', N'Asperiores labore in', N'<p>Ullam commodi in mag</p>', N'<h2>Imprint test data.</h2>', N'<h2>Data Protection test data</h2>', N'<p>Terms of use test data.</p>', N'Vergleiche schnell und einfach die Preise von medizinischem Cannabis bei verschiedenen Anbietern.', N'Finde den besten Preis für medizinisches Cannabis')
GO
INSERT [dbo].[tblArticles] ([Id], [Title], [Content], [URL], [ImagePath], [Date], [TagIds]) VALUES (N'791c2c52-0129-4b46-1799-08dd2a69eacf', N'Beauftragter für Sucht- und Drogenfragen lädt zur Zukunftskonferenz', N'Beauftragter für Sucht- und Drogenfragen lädt zur Zukunftskonferenz', N'https://www.grow.de/news-detailseite/politik-beauftragter-fuer-sucht-und-drogenfragen-laedt-zur-zukunftskonferenz', N'ddd45129-3217-4b12-a993-5d0309809d39.png', CAST(N'2025-02-08T00:00:00.0000000' AS DateTime2), N'[]')
GO
INSERT [dbo].[tblArticles] ([Id], [Title], [Content], [URL], [ImagePath], [Date], [TagIds]) VALUES (N'4c1f51bd-aa6d-432e-2c6c-08dd2ab2c939', N'Cannabis soll positive Wirkung auf das Altern haben', N'Cannabis soll positive Wirkung auf das Altern haben', N'https://www.grow.de/news-detailseite/forschung-cannabis-soll-positive-wirkung-auf-das-altern-haben', N'94775a7e-7b87-4174-8638-7be0c2c033a5.png', CAST(N'2025-02-08T00:00:00.0000000' AS DateTime2), N'[]')
GO
INSERT [dbo].[tblArticles] ([Id], [Title], [Content], [URL], [ImagePath], [Date], [TagIds]) VALUES (N'75cc0eff-df37-410a-2c6d-08dd2ab2c939', N'Industrie und Krankenkassen fordern: Nur noch medizinische Cannabis-Extrakte statt Blüten', N'Industrie und Krankenkassen fordern: Nur noch medizinische Cannabis-Extrakte statt Blüten', N'https://www.grow.de/news-detailseite/industrie-und-krankenkassen-fordern-nur-noch-medizinische-cannabis-extrakte-statt-blueten', N'46246e4c-ee33-4a06-82b7-52a66b11b545.png', CAST(N'2025-02-08T00:00:00.0000000' AS DateTime2), N'[]')
GO
INSERT [dbo].[tblArticleTag] ([ArticleId], [TagId]) VALUES (N'791c2c52-0129-4b46-1799-08dd2a69eacf', N'019422e6-dae3-70ff-8d1f-28a4fee37474')
GO
INSERT [dbo].[tblArticleTag] ([ArticleId], [TagId]) VALUES (N'4c1f51bd-aa6d-432e-2c6c-08dd2ab2c939', N'019422e6-dae3-70ff-8d1f-28a4fee37474')
GO
INSERT [dbo].[tblArticleTag] ([ArticleId], [TagId]) VALUES (N'75cc0eff-df37-410a-2c6d-08dd2ab2c939', N'019422e6-dae3-70ff-8d1f-28a4fee37474')
GO
INSERT [dbo].[tblCarousels] ([Id], [Title], [SubTitle], [Description], [ImagePath]) VALUES (N'01945267-186b-71b8-be8e-64348fbd3daa', NULL, NULL, NULL, N'c497c4a8-38db-4048-bee2-2f29b074d6e9.png')
GO
INSERT [dbo].[tblCategories] ([Id], [Name]) VALUES (N'070e911e-3632-4fe8-7a27-08dd2a698d04', N'New Flower''s')
GO
INSERT [dbo].[tblCBDShops] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'aa1b2179-1931-4dd2-98fe-08dd2ab24d57', N'Connor Mcintyre', N'Dignissimos adipisci', N'https://www.zixofypuruv.mobi', N'+1 (171) 954-1983', 1, N'vakaqedu@mailinator.com', N'Mohallah Said Nagri, Old City, Gujujranwala City Tehsil, Gujranwala District, Gujranwala Division, Punjab, 52250, Pakistan', 32.1574173, 74.1881, 410, N'Saturday', N'Monday', CAST(N'17:26:00' AS Time), CAST(N'05:58:00' AS Time), N'865b13da-61c7-4907-9d6d-584bf41aa0d6.png', N'498a6f31-dafa-43cc-bb32-5f1fab7665d9.png')
GO
INSERT [dbo].[tblDoctors] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'f0fcc4af-922e-4974-6deb-08dd2a62bbfc', N'Telecan', N'Mit unseren einfachen und digitalen Prozessen ermöglichen wir Dir den Zugang zu unseren spezialisierten, in Deutschland zugelassenen Ärzt:innen und zuverlässigen Partnerapotheken. ', N'https://telecan.de/', N'030 4397 1649 0', 1, N'support@telecan.de', N'Feurigstraße 54
10827 Berlin', 32.1488342, 74.21336, 35, N'Montag', N'Donnerstag', CAST(N'10:00:00' AS Time), CAST(N'17:00:00' AS Time), N'a38117b4-3e34-42ac-8bd4-f6cab6f8e003.png', N'f9765e36-dce8-4eb0-8b64-99b09377f90b.png')
GO
INSERT [dbo].[tblDoctors] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'a0b103d0-83fd-4454-a863-08dd4a9f6800', N'Kirestin Henderson', N'Wir bei WeTh legen unser Hauptaugenmerk auf die Behandlung und Beratung von Patientinnen und Patienten mit medizinischem Cannabis. Medizinisches Cannabis kann bei verschiedenen chronischen Erkrankungen und Symptomen eingesetzt werden und bietet eine interessante alternative Therapie zu konventionellen Behandlungen. Gerne beraten wir Sie im Erstgespräch, sei es in unseren Praxisstandorten in München und Berlin oder digital, ob und in welcher Form eine solche Therapie für Sie in Frage kommt und wie sie bei Ihnen angewendet werden könnte. Die Folgesprechstunden finden in der Regel bequem per Videosprechstunde statt.', N'https://www.weth-praxis.de/', N'+1 (197) 513-6636', 1, N'thalmaier@weth-praxis.de', N'Augustenstraße 47, 80333 München', 43, 14, 64, N'Montag', N'Freitag', CAST(N'08:00:00' AS Time), CAST(N'22:00:00' AS Time), N'44051505-2f9e-46a3-be79-9754be22928c.png', N'437b7272-6cd2-4b9e-b6ba-50e713419ad5.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'5874121b-af1d-4245-1d7e-08dd2a566db0', N'Schläfrig', N'fd693f66-d420-4ddc-ad7a-b983d173df6f.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'4830b2b4-71c1-45ae-a6fb-08dd2a5f8d7a', N'Relaxed', N'544f4d25-ad52-4583-ba07-fb8b9b7233e4.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'15b6629c-1bc7-4dfb-b059-08dd34da3429', N'Gesellig', N'45a11a68-ddb1-4103-83b1-ba0f0f68c04f.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'29e1d3d5-d6f5-4c58-b05a-08dd34da3429', N'Hungrig', N'cf6f6cdf-c29b-4581-9d33-2e22e200df9f.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'01a6442d-db83-4b6e-b05b-08dd34da3429', N'Glücklich', N'8bc626ba-9bd2-4002-86d3-b370e1697237.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'edc267d0-4e43-46f8-b05c-08dd34da3429', N'Kreativ', N'a58c2a95-4e9c-409b-91aa-67c5f221dacd.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'45adba01-e8a2-460d-b05d-08dd34da3429', N'Fokussiert', N'cdd8c327-8b9e-4125-b254-c710131a5939.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'6144a717-fe15-46fc-b05e-08dd34da3429', N'Albern', N'cb54fddc-0a67-496a-9266-39b040fe0809.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'5aa9024e-4997-4ba5-b05f-08dd34da3429', N'Euphorisch', N'81551d4b-8054-456c-b6d7-8024733f0f28.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'fbadf5e4-7792-4832-b060-08dd34da3429', N'Erregt', N'9b43a62c-c096-454e-90d4-6faa8794bb7c.png')
GO
INSERT [dbo].[tblEffects] ([Id], [Title], [ImagePath]) VALUES (N'c6cf76e7-116d-4b6c-b061-08dd34da3429', N'Energetisch', N'806db67a-2d3b-4a40-8fb4-98b157359db2.png')
GO
INSERT [dbo].[tblGrowEquipments] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'2479d7df-de70-4316-9d75-08dd2ab28de3', N'Tashya Dillard', N'Ut nisi cumque occae', N'https://www.regahequqeb.biz', N'+1 (904) 574-6255', 1, N'mejafaxes@mailinator.com', N'Sir Syed Ali Road, Police Lines, Satellite Town, Tanveer Town, Gujujranwala City Tehsil, Gujranwala District, Gujranwala Division, Punjab, 52200, Pakistan', 32.16425, 74.19582, 973, N'Thursday', N'Thursday', CAST(N'06:39:00' AS Time), CAST(N'12:29:00' AS Time), N'22255bc2-1861-46d8-85a8-9b7c704ce75f.png', N'e0d30681-b9e7-46d3-9319-6a3e83955d91.png')
GO
INSERT [dbo].[tblHeadShops] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'2e241e54-f910-47aa-aa57-08dd2ab26644', N'Dieter Snyder', N'Et qui dolor reprehe', N'https://www.zug.cm', N'+1 (568) 294-7697', 1, N'gecawah@mailinator.com', N'Satellite Town, Tanveer Town, Gujujranwala City Tehsil, Gujranwala District, Gujranwala Division, Punjab, 52200, Pakistan', 32.1597443, 74.20149, 620, N'Thursday', N'Tuesday', CAST(N'08:01:00' AS Time), CAST(N'16:38:00' AS Time), N'b6b485f7-024c-4232-b5c1-1f638cd9068d.png', N'3ce1a749-97e0-401d-b88d-0aab348dd142.png')
GO
INSERT [dbo].[tblLanguages] ([Culture], [Name]) VALUES (N'de-DE', N'Deutsch')
GO
INSERT [dbo].[tblLanguages] ([Culture], [Name]) VALUES (N'en-US', N'English')
GO
INSERT [dbo].[tblManufacturers] ([Id], [Name], [ImagePath]) VALUES (N'fcaa7458-7e38-4500-d4f5-08dd2a605873', N'Demecan', N'df4af0d2-ba65-4d52-9a88-8c660e354149.png')
GO
INSERT [dbo].[tblManufacturers] ([Id], [Name], [ImagePath]) VALUES (N'4e25a02d-b352-4ef9-eae1-08dd2ab2304c', N'Cantourage', N'5c6b7776-8cdb-4575-a757-6cbcf78e2ea0.png')
GO
INSERT [dbo].[tblManufacturers] ([Id], [Name], [ImagePath]) VALUES (N'7d29a0ee-745e-4daf-45ae-08dd328ab423', N'Avaay', N'61a2090f-c156-488b-bb8f-5eff8872c9b0.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'c579a3d5-240c-49a9-044f-08dd4563bade', N'Dänemark', N'88a29c54-3439-4766-9f6b-c0b3d2c9f003.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'1d7aa11e-0442-436f-c67d-08dd45705f6d', N'Deutschland', N'd7421fba-1bff-42cb-bbf1-01aaf430100d.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'019421d6-70eb-770d-b352-0d54c1cfeba8', N'Israel', N'5617d901-31c7-409b-a497-e1dce5849443.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'01946665-1f0a-7ddf-8874-508ae1f4a91c', N'Kanada', N'929566ec-6977-4e9a-8171-e4d2e549f89b.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'0194575d-084a-7fb9-b966-7bf203348184', N'Niederlande', N'8fb3607c-0bc1-4ee2-bade-9f17b8036421.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'01946665-a911-73a9-887e-9832cc60f30e', N'Mazedonien', N'b6634282-435d-40e0-a275-0c0a59c688f7.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'01946665-5043-7681-a03e-d12ccf46329e', N'Portugal', N'b0f0e118-8161-4a64-a763-8b642cb678dd.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'01946665-86b3-732d-b19f-d7d61e8448d9', N'Südafrika', N'a8a732ed-8b53-4a51-97d6-a923e00a9eec.png')
GO
INSERT [dbo].[tblOrigins] ([Id], [Name], [ImagePath]) VALUES (N'01946665-6ba9-7cc6-aee2-dd323936c704', N'Uruguay', N'a529cb5b-284f-43d7-8928-abf7fc99111d.png')
GO
INSERT [dbo].[tblPartnerLogos] ([Id], [ImagePath]) VALUES (N'01942383-c6d0-71d9-be47-63f696f70b2f', N'36dd2bea-b2f7-48e5-b73d-944ca7df1f83.png')
GO
INSERT [dbo].[tblPartnerLogos] ([Id], [ImagePath]) VALUES (N'01946673-1896-7fdb-a8b4-a85478868ee0', N'c55c6f0d-9745-4a63-940a-9d5eb6c00bca.png')
GO
INSERT [dbo].[tblPartnerLogos] ([Id], [ImagePath]) VALUES (N'01942383-5f38-7999-a640-d5ed0c7f22b2', N'eac0b18c-9989-4539-8ef4-545553599357.png')
GO
INSERT [dbo].[tblPartnerLogos] ([Id], [ImagePath]) VALUES (N'01946673-f2f4-722c-8072-e67730447f0c', N'9184d215-7d7f-4051-b546-0cb3c326d1ff.png')
GO
INSERT [dbo].[tblPharmacies] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'96e33a63-e20b-4169-8442-08dd3bda5b27', N'Cannabis Apotheke Nordostbahnhof', N'In der Cannabis Apotheke am Nordostbahnhof haben Sie die Möglichkeit, medizinisches Cannabis auf Rezept zu erhalten.
', N'https://cannabis-nordost.de', N'+49 911 47 71 19 10', 1, N'info@cannabis-nordost.de', N'Äußere Bayreuther Str. 105, 90409 Nürnberg', 32.1693344, 74.18982, 0, N'Montag', N'Freitag', CAST(N'08:00:00' AS Time), CAST(N'19:00:00' AS Time), N'b67601b9-8a58-4133-90b6-19fb3f1a87af.png', N'eab4fdfb-4781-4aff-9cc8-65b060893d16.png')
GO
INSERT [dbo].[tblPharmacies] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'40279e48-8fb7-461b-a663-08dd3c00152a', N'Zaza Pidgeon', N'Dolore porro est qui', N'https://www.zazapidgeon.de/ueber-uns', N'0911 227863', 0, N'info@zazapidgeon.de', N'Spitalgasse 2 Nürnberg, 90403', 32.3142357, 74.0015, 0, N'Montag', N'Freitag', CAST(N'08:00:00' AS Time), CAST(N'19:00:00' AS Time), N'0516e36a-6b4f-4dd9-a97a-e8bc61e794c9.png', N'd4c860a4-7a33-4fe5-9148-1ff53e2144b4.png')
GO
INSERT [dbo].[tblPharmacies] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'30020023-bf70-49ed-a664-08dd3c00152a', N'Cannafino', N'Wir bieten eine breite Palette an streng geprüften Cannabissorten, die höchsten Qualitätsstandards entsprechen.
Unser speziell ausgebildetes Team beantwortet Ihnen gerne alle Fragen rund um medizinisches Cannabis.', N'https://cannafino.de', N'0911-50720-130', 1, N'info@cannafino.de', N'Bahnhofplatz 6, 90762 Fürth', 32.3251152, 73.98949, 0, N'Montag', N'Freitag', CAST(N'08:30:00' AS Time), CAST(N'18:00:00' AS Time), N'3b755352-499e-413e-b536-9a0e94de4277.png', N'656821fa-72e8-472e-a885-afa1132f46f7.png')
GO
INSERT [dbo].[tblPharmacies] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'9a3e694b-7e5d-48fe-e32f-08dd47b1beb6', N'Collini Apotheke', N'Ihre Experten für medizinisches Cannabis - Exzellente Beratung, schnelle & zuverlässige Lieferung, faire Preise', N'https://www.collini-medflower.de', N'+49 (0)322 2200 11 06', 0, N'bestellungen@collini-apotheke.de', N'Collinistr. 11, 68161 Mannheim', 0, 0, 0, N'Montag', N'Freitag', CAST(N'09:00:00' AS Time), CAST(N'17:00:00' AS Time), N'fc75439e-4341-45db-9e75-aeb4bc8b7f40.png', N'8e4f3b5b-bde7-419a-b927-762792e3df5c.png')
GO
INSERT [dbo].[tblPharmacies] ([Id], [Name], [Description], [ProfileUrl], [Phone], [IsVerified], [Email], [Address], [Lat], [Long], [Price], [StartDay], [EndDay], [StartTime], [EndTime], [ImagePath], [CoverImagePath]) VALUES (N'56d04e59-14cd-4299-d198-08dd4a890027', N'Jiroo', N'jiroo ist eine Online-Apotheke für den Versand von medizinischem Cannabis. Mitten aus Berlin liefern wir direkt
zu Ihnen nach Hause – und das deutschlandweit.', N'https://jiroo.de', N'0307430466630', 0, N'kontakt@jiroo.de', N'Mariendorfer Damm 165
12107 Berlin-Tempelhof', 0, 0, 0, N'Montag', N'Sonntag', CAST(N'00:00:00' AS Time), CAST(N'23:59:00' AS Time), N'b4ff5758-b83f-44cf-a7a0-5296d7970616.png', N'23e2f9c2-d513-45e9-9f50-f4119fe1868b.png')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'4830b2b4-71c1-45ae-a6fb-08dd2a5f8d7a')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'4830b2b4-71c1-45ae-a6fb-08dd2a5f8d7a')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'4830b2b4-71c1-45ae-a6fb-08dd2a5f8d7a')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'4830b2b4-71c1-45ae-a6fb-08dd2a5f8d7a')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'4830b2b4-71c1-45ae-a6fb-08dd2a5f8d7a')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'15b6629c-1bc7-4dfb-b059-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'15b6629c-1bc7-4dfb-b059-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'29e1d3d5-d6f5-4c58-b05a-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'29e1d3d5-d6f5-4c58-b05a-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'29e1d3d5-d6f5-4c58-b05a-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'01a6442d-db83-4b6e-b05b-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'01a6442d-db83-4b6e-b05b-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'01a6442d-db83-4b6e-b05b-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'01a6442d-db83-4b6e-b05b-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'01a6442d-db83-4b6e-b05b-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'edc267d0-4e43-46f8-b05c-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'edc267d0-4e43-46f8-b05c-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'edc267d0-4e43-46f8-b05c-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'45adba01-e8a2-460d-b05d-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'45adba01-e8a2-460d-b05d-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'6144a717-fe15-46fc-b05e-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'6144a717-fe15-46fc-b05e-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'6144a717-fe15-46fc-b05e-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'5aa9024e-4997-4ba5-b05f-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'5aa9024e-4997-4ba5-b05f-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'5aa9024e-4997-4ba5-b05f-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'5aa9024e-4997-4ba5-b05f-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'5aa9024e-4997-4ba5-b05f-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'5aa9024e-4997-4ba5-b05f-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'fbadf5e4-7792-4832-b060-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'fbadf5e4-7792-4832-b060-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'c6cf76e7-116d-4b6c-b061-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'c6cf76e7-116d-4b6c-b061-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'c6cf76e7-116d-4b6c-b061-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'c6cf76e7-116d-4b6c-b061-08dd34da3429')
GO
INSERT [dbo].[tblProductEffect] ([ProductId], [EffectId]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'c6cf76e7-116d-4b6c-b061-08dd34da3429')
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'96e33a63-e20b-4169-8442-08dd3bda5b27', 482)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'40279e48-8fb7-461b-a663-08dd3c00152a', 332)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'30020023-bf70-49ed-a664-08dd3c00152a', 564)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'9a3e694b-7e5d-48fe-e32f-08dd47b1beb6', 621)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'30020023-bf70-49ed-a664-08dd3c00152a', 8.99)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'96e33a63-e20b-4169-8442-08dd3bda5b27', 463)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'30020023-bf70-49ed-a664-08dd3c00152a', 222)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'9a3e694b-7e5d-48fe-e32f-08dd47b1beb6', 761)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'96e33a63-e20b-4169-8442-08dd3bda5b27', 707)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'40279e48-8fb7-461b-a663-08dd3c00152a', 25)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'9a3e694b-7e5d-48fe-e32f-08dd47b1beb6', 808)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194ed53-4162-7367-af64-dfd84f1f8ca8', N'96e33a63-e20b-4169-8442-08dd3bda5b27', 672)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194ed53-4162-7367-af64-dfd84f1f8ca8', N'40279e48-8fb7-461b-a663-08dd3c00152a', 580)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194ed53-4162-7367-af64-dfd84f1f8ca8', N'30020023-bf70-49ed-a664-08dd3c00152a', 284)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194ed88-1c4d-743f-809d-e64247285ae3', N'40279e48-8fb7-461b-a663-08dd3c00152a', 794)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194ed88-1c4d-743f-809d-e64247285ae3', N'30020023-bf70-49ed-a664-08dd3c00152a', 637)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'96e33a63-e20b-4169-8442-08dd3bda5b27', 9.99)
GO
INSERT [dbo].[tblProductPharmacies] ([ProductId], [PharmacyId], [Price]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'56d04e59-14cd-4299-d198-08dd4a890027', 9.64)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'Malachi Douglas', N'Chelsea Garrett', N'Hybrid', 0, 14, 14, 867, N'Un-Available', N'019423f2-2008-786d-a86c-f5ed88358597', N'fcaa7458-7e38-4500-d4f5-08dd2a605873', N'["a780b469-6438-4ff8-b246-c9fbc6fdb011.png","4557d15c-0079-4837-bab3-f1df4723e7dc.png","af49fb89-ef9f-4eea-9e91-0d7e02b859eb.png"]', N'Featured', N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Modi omnis aliquam e', N'Hic accusamus laboru', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'Echo Oneill', N'Dante Cote', N'Hybrid', 0, 98, 56, 300, N'Available', N'c579a3d5-240c-49a9-044f-08dd4563bade', N'7d29a0ee-745e-4daf-45ae-08dd328ab423', N'["f7bb3aef-9dcc-4cad-a69d-1db6e1d14020.png","63fcdfbc-373c-4152-bfed-23e32112e6c8.png","43fa001c-7f29-4d6f-974c-d8e5e9cdf445.png"]', N'Advertisement', N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Minus culpa corporis', N'Ut consequatur Cons', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'Flap Jacks 24/1', N'Roxton Air BD ', N'Hybrid', 0, 1, 24, 7.99, N'Available', N'01946665-1f0a-7ddf-8874-508ae1f4a91c', N'4e25a02d-b352-4ef9-eae1-08dd2ab2304c', N'["28b5f52f-ffd5-42ac-bafd-b7f3325c50c9.png","95d08c18-3f7b-490a-a953-6ebedc9cd8c5.png","2b6bc88a-e1a3-48e0-a727-8e0f7e12f980.png"]', N'Advertisement', N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Das Aussehen der Flap Jacks Buds ist klassisch. Sie haben runde, voluminöse  Körper, die in saftigem Grün erscheinen. Die einzelnen Buds reagieren auf leichten Druck wiederstandsfähig und liegen relativ massiv auf der Hand. Bei Druck verströmen die Blütenkörper außerdem einen süßen Duft. 
Das Geschmacksprofil von Flap Jacks ist Mannigfaltig. Während des Rauchens entfaltet sich eine harmonische Komposition aus cremiger Süße und erdiger Würze. Anspruchsvolle Genießer*innen erkennen ergänzende Geschmacksnuancen von Kiefer und Beere, deren exotische Fusion ein besonders angenehmes Raucherlebnis offenbart.
Flap Jacks ist eine Kreuzung aus MacFlurry und Pancakes.
', N'Der lizenzierte Anbauer Roxton Air aus Kanada hat sich im ländlichen Québec auf die Kultivierung hochwertiger Cannabisvarietäten spezialisiert. Energie- und wassersparende Methoden versprechen einen nachhaltigen Anbau ohne Abstriche bei der Qualität und Wirksamkeit der Pflanzen.', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'Greyscales PS 21/11', N'Pink Slurricane ', N'Hybrid', 0, 1, 21, 13, N'Available', NULL, N'4e25a02d-b352-4ef9-eae1-08dd2ab2304c', N'["a3ca251e-11ce-4c94-b15e-0a7f1b5cff1a.png","e4bb4232-174c-410d-8e2e-b39335fc7e81.png","d8ff475d-550a-497f-b585-161a6cabcc47.png"]', N'Advertisement', N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Die Buds des Pink Slurricane leuchten wie ein Feuer: Zahlreiche orangefarbene Pistillen umschließen die gelbgrünen und sehr weichen Blütenkörper dieses Strains.
Pink Slurricane ist nicht nur bloß ein Augenschmaus. Die Raucherfahrung zeichnet sich durch ihre ästhetische Fülle und eine frühlingshafte Frische aus. Das geschmackliche Kennzeichen des Strains liegt in seinem süßlichen Beerenaroma, das durch würzige und zitronige Noten ergänzt wird.
Pink Slurricane ist eine Kreuzung aus Purple Punch und Do-Si-Dos.
Patient*innen berichten von einer euphorisierenden und zugleich körperlich entspannenden Wirkung. Pink Slurricane eignet sich zur Behandlung chronischer Schmerzen, Krämpfe und zur Verbesserung von Schlafstörungen.', N'LOT420 mit Sitz südöstlich von Montreal, Kanada. Das
Team besteht aus erfahrenen Anbauern mit individu-
eller Expertise. Mit bewährten Methoden wird jede
Charge sorgfältig angebaut, getrocknet und von Hand
geschnitten, um Patient:innen das hochwertigste Pro-
dukt zu bieten. Greyscales steht für ein erstklassiges
Preis-Qualitäts-Verhältnis.', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'Daryl Berg', N'Amelia Pratt', N'Hybrid', 0, 99, 9, 432, N'Available', N'c579a3d5-240c-49a9-044f-08dd4563bade', N'7d29a0ee-745e-4daf-45ae-08dd328ab423', N'["16afaf76-9ee1-421b-809d-18ef5c2409ab.png","e39d5431-73e5-4be4-938f-45aaaa71260e.png","cfab28a6-4d00-497a-ac96-e1f62347c218.png"]', N'Featured', N'39d532c8-f8ae-43fc-a423-08dd4563206f', N'Atque porro molestia', N'Dolor ut excepteur e', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'Camille Vasquez', N'Graiden Middleton', N'Hybrid', 0, 11, 39, 325, N'Un-Available', N'01946665-6ba9-7cc6-aee2-dd323936c704', N'fcaa7458-7e38-4500-d4f5-08dd2a605873', N'["e5aff58e-28cd-43fd-92fb-766bd391288e.png","443de1e7-f1ac-4d4c-9cd7-37370c4d3e3a.png","aef079d8-356a-437a-ab58-a8b1431c9e28.png"]', N'Featured', N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Error quo magni quia', N'Assumenda vero debit', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194ed53-4162-7367-af64-dfd84f1f8ca8', N'Wynter Cox', N'Moana Hayes', N'Indica', 0, 17, 97, 388, N'Un-Available', N'c579a3d5-240c-49a9-044f-08dd4563bade', N'fcaa7458-7e38-4500-d4f5-08dd2a605873', N'[]', N'Advertisement', N'39d532c8-f8ae-43fc-a423-08dd4563206f', N'Eveniet vero volupt', N'Sunt ab qui proident', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194ed88-1c4d-743f-809d-e64247285ae3', N'Kimberley Harding', N'Hermione Lowe', N'Sativa', 0, 87, 55, 967, N'Available', N'019421d6-70eb-770d-b352-0d54c1cfeba8', N'4e25a02d-b352-4ef9-eae1-08dd2ab2304c', N'["04c3b220-7c83-4f4f-be89-2eee48728896.png","05505548-b6b8-48b8-b40b-a7295ca44a26.png","819b7a50-6e36-46e1-92a5-23f2918fe76c.png","24300401-4801-4d60-be3b-fd5f956ff277.png","3a9d4cf3-372d-47ae-b021-97a6f7238151.png"]', N'Shop', N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Obcaecati sequi pers', N'Reprehenderit lauda', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'Ceres NO. 5 25/1', N'Super Boot ', N'Hybrid', 0, 1, 25, 8.85, N'Available', N'01946665-1f0a-7ddf-8874-508ae1f4a91c', N'4e25a02d-b352-4ef9-eae1-08dd2ab2304c', N'["8e419765-2d97-4924-b0c8-945bfe0a7836.png","e9e88d73-ee9e-45aa-8d86-8b50a8241bb4.png","429f9bc3-5494-4a2d-bd62-c6eeb44facee.png"]', N'Advertisement', N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Super Boof Strains entwickeln, abhängig von der Trichomendichte, hellgrüne bis weiß schimmernde Blüten, die von sonnengelben Pistillen überzogen sind. 
Aufgrund der hohen Trichomendichte des Strains sind die Blüten von Super Boof nicht nur besonders klebrig, die vielen Trichome sorgen außerdem für ein ausgesprochen vollmundiges Bouquet aus süßen und fruchtigen Noten.
Beim Rauchen entfaltet sich zunächst ein ausgeprägter Zitrusgeschmack, der sich während des lang anhaltenden Abgangs in einen süßen bis süß-erdigen Geschmack wandelt.
Super Boof ist eine Kreuzung aus Black Cherry Punch und Tropicana Cookies.
', N'Plantations Cérès ist ein familiengeführtes Unterneh- men aus Québec, das sich mit Hilfe moderner Techno- logien auf die Kultivierung von hochwertigem Cannabis konzentriert. Hier gilt der Leitsatz: Qualität vor Quan- tität. Der Fokus auf den kontrollierten Anbau kleiner Chargen zahlt sich in einer gleichbleibend hohen Quali- tät aus.', 0)
GO
INSERT [dbo].[tblProducts] ([Id], [Name], [SaleName], [Genetics], [Rating], [CBD], [THC], [Price], [IsAvailable], [OriginId], [ManufacturerId], [ImagePath], [FeaturedProduct], [RayId], [AboutFlower], [GrowerDescription], [DefaultImageIndex]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'ALL NATIONS FG 25/1 ', N'Frosted Gelato', N'Indica', 0, 1, 25, 9.64, N'Available', N'01946665-1f0a-7ddf-8874-508ae1f4a91c', N'4e25a02d-b352-4ef9-eae1-08dd2ab2304c', N'["d3f82a37-399e-401f-8142-21bfec20ccd3.png","5b4c2f73-75cc-42ea-b3ef-db6e3ffc3c76.png","f056d890-2b4f-4db7-99f8-80e74be6d6a0.png"]', N'Featured', N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Das Aussehen der Flap Jacks Buds ist klassisch. Sie haben runde, voluminöse  Körper, die in saftigem Grün erscheinen. Die einzelnen Buds reagieren auf leichten Druck wiederstandsfähig und liegen relativ massiv auf der Hand. Bei Druck verströmen die Blütenkörper außerdem einen süßen Duft. 
Das Geschmacksprofil von Flap Jacks ist Mannigfaltig. Während des Rauchens entfaltet sich eine harmonische Komposition aus cremiger Süße und erdiger Würze. Anspruchsvolle Genießer*innen erkennen ergänzende Geschmacksnuancen von Kiefer und Beere, deren exotische Fusion ein besonders angenehmes Raucherlebnis offenbart.
Flap Jacks ist eine Kreuzung aus MacFlurry und Pancakes.
', NULL, 0)
GO
INSERT [dbo].[tblProductStrain] ([ProductId], [StrainId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'6e501e2a-2f42-41f6-3a1e-08dd2a5fa45e')
GO
INSERT [dbo].[tblProductStrain] ([ProductId], [StrainId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'6e501e2a-2f42-41f6-3a1e-08dd2a5fa45e')
GO
INSERT [dbo].[tblProductStrain] ([ProductId], [StrainId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'6e501e2a-2f42-41f6-3a1e-08dd2a5fa45e')
GO
INSERT [dbo].[tblProductStrain] ([ProductId], [StrainId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'cde17f3f-c531-44c5-1391-08dd47a3f97f')
GO
INSERT [dbo].[tblProductStrain] ([ProductId], [StrainId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'cde17f3f-c531-44c5-1391-08dd47a3f97f')
GO
INSERT [dbo].[tblProductStrain] ([ProductId], [StrainId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'cde17f3f-c531-44c5-1391-08dd47a3f97f')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'4ce6447a-9946-40d3-27a7-08dd2ab1ef43')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'4ce6447a-9946-40d3-27a7-08dd2ab1ef43')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'4ce6447a-9946-40d3-27a7-08dd2ab1ef43')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'4ce6447a-9946-40d3-27a7-08dd2ab1ef43')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'77fbde2e-85f5-4845-f647-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'77fbde2e-85f5-4845-f647-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'77fbde2e-85f5-4845-f647-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'77fbde2e-85f5-4845-f647-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'77fbde2e-85f5-4845-f647-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'8904f3c6-a0cf-4ff5-f648-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'8904f3c6-a0cf-4ff5-f648-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'8904f3c6-a0cf-4ff5-f648-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'8904f3c6-a0cf-4ff5-f648-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'bcbe7f6b-5c89-40c0-f649-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'bcbe7f6b-5c89-40c0-f649-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'bcbe7f6b-5c89-40c0-f649-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'bcbe7f6b-5c89-40c0-f649-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'9e55d85c-a981-4eb8-f64a-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'9e55d85c-a981-4eb8-f64a-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'9e55d85c-a981-4eb8-f64a-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'9e55d85c-a981-4eb8-f64a-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'8eed1573-dbc7-442a-f64b-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'6f645d9a-9875-4417-f64c-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'6f645d9a-9875-4417-f64c-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'5accfe4a-9e99-4529-f64d-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'5accfe4a-9e99-4529-f64d-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'1f43203e-bca0-4b34-f64e-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'1f43203e-bca0-4b34-f64e-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'1f43203e-bca0-4b34-f64e-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'b6e8a893-f0df-4bb6-f64f-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'b6e8a893-f0df-4bb6-f64f-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'e045db7e-c7fc-4455-f650-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'e045db7e-c7fc-4455-f650-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'6f14eb2f-5528-45e8-f651-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'6f14eb2f-5528-45e8-f651-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'6f14eb2f-5528-45e8-f651-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'bd7bb7ac-d772-4d07-f652-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'bd7bb7ac-d772-4d07-f652-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'bd7bb7ac-d772-4d07-f652-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'602c84c3-e2a6-405c-f653-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'602c84c3-e2a6-405c-f653-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'a01cba6d-0f77-415a-f654-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'a01cba6d-0f77-415a-f654-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'f67b71c2-125e-487d-f655-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'f67b71c2-125e-487d-f655-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'52e1ffe7-15e5-41fb-f656-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'52e1ffe7-15e5-41fb-f656-08dd34d530b3')
GO
INSERT [dbo].[tblProductTaste] ([ProductId], [TasteId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'52e1ffe7-15e5-41fb-f656-08dd34d530b3')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'3393e0b5-081d-400f-c940-08dd2a5eb5cf')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'3393e0b5-081d-400f-c940-08dd2a5eb5cf')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'28c3b7ae-b5b9-47b8-e31c-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'370e0841-6506-476f-e320-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'e191e03a-40ee-4daf-e323-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'e191e03a-40ee-4daf-e323-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'2d0d2ea3-4a04-4913-e324-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'5f90409f-70df-4409-e325-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'79cdbbfd-7035-49ea-e327-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'5be0432c-fbaf-405a-e328-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'5be0432c-fbaf-405a-e328-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'ccc256ac-ae1b-4b61-e32a-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'ccc256ac-ae1b-4b61-e32a-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'0d64e679-a623-4a2c-e32b-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'0d64e679-a623-4a2c-e32b-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'0d64e679-a623-4a2c-e32b-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'0d64e679-a623-4a2c-e32b-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'0d64e679-a623-4a2c-e32b-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'0d64e679-a623-4a2c-e32b-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'171b3f72-8f14-4308-e32c-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'171b3f72-8f14-4308-e32c-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'01945758-1f17-7eef-a36a-7c5fcb3a1eb6', N'171b3f72-8f14-4308-e32c-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194de99-4461-70cf-a818-e664e95ab941', N'171b3f72-8f14-4308-e32c-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'171b3f72-8f14-4308-e32c-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'2504f82b-4986-4c40-e32d-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194dea1-155b-70fc-bda8-67f4dce0221e', N'2504f82b-4986-4c40-e32d-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'2504f82b-4986-4c40-e32d-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194decd-98ac-708e-a634-fba08bb47d2f', N'2504f82b-4986-4c40-e32d-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'8cb91e2b-5199-4956-e32e-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'8cb91e2b-5199-4956-e32e-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'8cb91e2b-5199-4956-e32e-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'5dc0bce0-82dc-4bee-e32f-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'5dc0bce0-82dc-4bee-e32f-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'4cda5c6b-48c0-4078-e330-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'4cda5c6b-48c0-4078-e330-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'000812f6-e5ca-42de-e331-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'000812f6-e5ca-42de-e331-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'4141af5f-f50d-41ed-e332-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'ee754f19-b63f-4069-e333-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'ee754f19-b63f-4069-e333-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'ee3a67db-f8a2-402f-e334-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'ee3a67db-f8a2-402f-e334-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'c0da7832-444f-4b7b-e335-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e625-fb61-7317-8117-5a1650d8550e', N'aac2de98-2e41-424f-e336-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'aac2de98-2e41-424f-e336-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e70e-2302-7b2e-927a-505481d42bae', N'7ebf295e-f919-4911-e337-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'7ebf295e-f919-4911-e337-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'af33ae18-dc7e-43f3-e338-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'2aa1d0d2-a047-4684-e33a-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61a-c655-712a-994d-91268363ee2f', N'b4e9aaea-d2d9-4878-e33b-08dd34da880f')
GO
INSERT [dbo].[tblProductTerpene] ([ProductId], [TerpeneId]) VALUES (N'0194e61d-c72a-7bdd-a0b8-bd004413bf06', N'b4e9aaea-d2d9-4878-e33b-08dd34da880f')
GO
INSERT [dbo].[tblRays] ([Id], [Name], [ImagePath]) VALUES (N'bac76497-df44-44c8-05e0-08dd4555a54e', N'Unbestrahlt', N'89626b9a-15f6-4075-af8e-971b54ab4c82.png')
GO
INSERT [dbo].[tblRays] ([Id], [Name], [ImagePath]) VALUES (N'39d532c8-f8ae-43fc-a423-08dd4563206f', N'Bestrahlt', N'7793570a-0a57-4ac1-b63d-0805cd0479f0.png')
GO
INSERT [dbo].[tblShopDescriptions] ([Id], [Title], [Description], [ImagePath]) VALUES (N'01942cba-b864-700a-bf4a-0061c5eb6270', N'Ärzte und Telemedizin', N'Finde spezialisierte Mediziner für deine Cannabis Therapie', N'9d8f37d1-e652-4df4-aa24-49298c247188.png')
GO
INSERT [dbo].[tblShopDescriptions] ([Id], [Title], [Description], [ImagePath]) VALUES (N'01942cbb-e0ee-7d0b-8f65-2dd1196234d1', N'Alles auf einem Blick ', N'Spare Zeit & Geld durch transparente Preisübersichten', N'e64e6c21-85b7-447d-9492-41fbaceac121.png')
GO
INSERT [dbo].[tblShopDescriptions] ([Id], [Title], [Description], [ImagePath]) VALUES (N'01942cbb-46ae-7609-a41e-4a59340c4df5', N'Merch by Fuego', N'Finde passendes Zubehör und Produkte rund um Cannabis', N'77fd2b9f-40d0-4a27-bfa0-3c8cbe0eef1a.png')
GO
INSERT [dbo].[tblShopDescriptions] ([Id], [Title], [Description], [ImagePath]) VALUES (N'01942cbc-61bf-7450-a227-b02be854c1ef', N'Alles Legit', N'Bei uns findest du nur vertrauenswürdige und geprüfte Anbieter', N'a27b785b-7a5c-4c5d-8287-5ece72b793ac.png')
GO
INSERT [dbo].[tblStrains] ([Id], [Name]) VALUES (N'e1e17859-364f-40cc-fe6e-08dd2a56738b', N'Test Strain')
GO
INSERT [dbo].[tblStrains] ([Id], [Name]) VALUES (N'6e501e2a-2f42-41f6-3a1e-08dd2a5fa45e', N'Olive')
GO
INSERT [dbo].[tblStrains] ([Id], [Name]) VALUES (N'cde17f3f-c531-44c5-1391-08dd47a3f97f', N'New Strain')
GO
INSERT [dbo].[tblTags] ([Id], [Title]) VALUES (N'019422e6-dae3-70ff-8d1f-28a4fee37474', N'Breaking News')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'0d5ccfc6-7b3a-4821-32d4-08dd2a56623a', N'Fruchtig', N'efd3e275-0b4b-4689-bc7d-1aa158e97104.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'4ce6447a-9946-40d3-27a7-08dd2ab1ef43', N'Citrus', N'127fa25d-9614-4abb-9f1f-0fe87f8b7a1d.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'77fbde2e-85f5-4845-f647-08dd34d530b3', N'Würzig', N'560d8665-5c1d-4f68-96b3-80c527baea7b.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'8904f3c6-a0cf-4ff5-f648-08dd34d530b3', N'Süß', N'35c1a67c-94d8-4601-a776-3d6ceeb18da4.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'bcbe7f6b-5c89-40c0-f649-08dd34d530b3', N'Holzig', N'9e57e706-5243-4fc6-a3c0-0d5daf35e481.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'9e55d85c-a981-4eb8-f64a-08dd34d530b3', N'Erdig', N'aa22f345-6671-4afe-9946-6dff613abb29.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'8eed1573-dbc7-442a-f64b-08dd34d530b3', N'Blumen', N'5acaa98d-fd68-4e2c-93a9-5a7e6046582d.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'6f645d9a-9875-4417-f64c-08dd34d530b3', N'Vanille', N'd175a50c-f757-43d2-b305-f4fd4a5132f0.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'5accfe4a-9e99-4529-f64d-08dd34d530b3', N'Minze', N'092b55af-be15-4c12-a4a9-ef8c9e583a47.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'1f43203e-bca0-4b34-f64e-08dd34d530b3', N'Kiefer', N'469d10fc-476d-40cd-8fe0-403600058cff.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'b6e8a893-f0df-4bb6-f64f-08dd34d530b3', N'Kräuter', N'74e476f9-ecbe-467c-9c25-b5e6b56d1305.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'e045db7e-c7fc-4455-f650-08dd34d530b3', N'Teer', N'53935cdf-fa2a-4b43-aa79-45a687295ddf.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'6f14eb2f-5528-45e8-f651-08dd34d530b3', N'Tropical', N'235f04c9-c7d2-40c5-8b3d-5c581b801087.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'bd7bb7ac-d772-4d07-f652-08dd34d530b3', N'Diesel', N'a93204ad-94bf-4207-b989-66851375308a.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'602c84c3-e2a6-405c-f653-08dd34d530b3', N'Kaffee', N'90404193-922a-44a0-b70b-81864c4a24a2.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'a01cba6d-0f77-415a-f654-08dd34d530b3', N'Käse', N'a2f9602c-8d2c-4d7e-a5d6-a0115a1fef51.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'f67b71c2-125e-487d-f655-08dd34d530b3', N'Tabak', N'51b23329-8af1-49f8-aaf2-92932a013887.png')
GO
INSERT [dbo].[tblTastes] ([Id], [Title], [ImagePath]) VALUES (N'52e1ffe7-15e5-41fb-f656-08dd34d530b3', N'Salbei', N'2382e50e-1d9f-4091-b40e-ce7a451d2ca6.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'893e2146-2389-4e8e-8190-08dd2a5650e4', N'Campene', N'5e2ada3f-ac49-454c-bf58-314efa78412b.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'3393e0b5-081d-400f-c940-08dd2a5eb5cf', N'Eugcal', N'b6177348-09e2-4b98-acba-7b7a1a63325d.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'28c3b7ae-b5b9-47b8-e31c-08dd34da880f', N'Fenchel', N'9b8b1465-05a9-48f7-a3b3-b42dd518d30a.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'370e0841-6506-476f-e320-08dd34da880f', N'Flieder', N'113d4213-ca72-4e03-b72f-500baeea9725.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'3e536a73-e1b4-4fa4-e321-08dd34da880f', N'Fruchtig', N'a7993c9e-3f12-4803-8b2f-26f3205fd099.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'faeb087b-7f97-421e-e322-08dd34da880f', N'Geranie', N'7fea18b0-e03f-46ce-903b-e1ad3d93f8a1.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'e191e03a-40ee-4daf-e323-08dd34da880f', N'Grass', N'47985479-bbe1-4de2-888a-76dda1de98f3.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'2d0d2ea3-4a04-4913-e324-08dd34da880f', N'hopfen', N'5aa88f12-6315-4245-83ea-9e18bf95bfc4.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'5f90409f-70df-4409-e325-08dd34da880f', N'kamille', N'a4b13fd0-8106-460e-a9be-3157c25c1fa6.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'0ccd9b24-257f-44eb-e326-08dd34da880f', N'Kardamon', N'a64c8fe0-00fb-4b46-abf5-1082d48bbeec.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'79cdbbfd-7035-49ea-e327-08dd34da880f', N'Geraniol', N'd09cc8b8-74e9-44af-ae6e-0711875a1793.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'5be0432c-fbaf-405a-e328-08dd34da880f', N'Geranylacetat', N'4a121336-75c0-48bb-bbde-39d69afd6c88.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'39fa8262-a1c3-4c30-e329-08dd34da880f', N'Guaiol', N'facbe658-7bec-4885-bf9e-2d07f8cec3f1.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'ccc256ac-ae1b-4b61-e32a-08dd34da880f', N'Humulen', N'f8795a52-ee89-496c-a93a-f48ca47491c7.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'0d64e679-a623-4a2c-e32b-08dd34da880f', N'Limonen', N'29012beb-2f28-4709-ae83-18af324491da.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'171b3f72-8f14-4308-e32c-08dd34da880f', N'Linalool', N'2b9594c7-ae33-436d-b443-0c7b650303f8.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'2504f82b-4986-4c40-e32d-08dd34da880f', N'Myrcen', N'3c14883e-5fc7-4134-a395-cb9ac5b8ee17.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'8cb91e2b-5199-4956-e32e-08dd34da880f', N'Nerolidol', N'c41445c1-eaa6-45bb-87ea-196afddd19db.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'5dc0bce0-82dc-4bee-e32f-08dd34da880f', N'Ocimen', N'3c3b13a9-330e-46f7-81e5-044cd1cbf387.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'4cda5c6b-48c0-4078-e330-08dd34da880f', N'p-Cymen', N'7cb6da79-7e77-43b5-b29a-320c948fc279.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'000812f6-e5ca-42de-e331-08dd34da880f', N'Pinene', N'5b5d7e0d-3b31-42eb-a73f-2105a94ad986.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'4141af5f-f50d-41ed-e332-08dd34da880f', N'Terpinolen', N'93d0a4a6-f822-4ac3-9456-35f407489d5d.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'ee754f19-b63f-4069-e333-08dd34da880f', N'Trans-Bergamoten', N'7e3eba53-4d37-4137-b05d-6929ceb112cc.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'ee3a67db-f8a2-402f-e334-08dd34da880f', N'Trans-Caryophyllen', N'd180e548-66e0-480f-aaeb-58172506882a.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'c0da7832-444f-4b7b-e335-08dd34da880f', N'trans-Nerolidol', N'c71f5de1-275d-48a0-9d62-e3c721ec6248.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'aac2de98-2e41-424f-e336-08dd34da880f', N'Trans-β-Farnesen', N'81decabb-ae63-4ea9-817b-959e46468217.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'7ebf295e-f919-4911-e337-08dd34da880f', N'Alpha-Selinen', N'14b7d0aa-6443-43cd-92cf-28b87a684401.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'af33ae18-dc7e-43f3-e338-08dd34da880f', N'Germacrene', N'545cd3b8-7160-4128-b4ed-8e0b2628991c.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'2aa1d0d2-a047-4684-e33a-08dd34da880f', N'Valencene', N'256f78d0-8bcb-4e7c-bae2-a73078bf88d5.png')
GO
INSERT [dbo].[tblTerpenes] ([Id], [Title], [ImagePath]) VALUES (N'b4e9aaea-d2d9-4878-e33b-08dd34da880f', N'Phellandrene', N'6435e726-d845-4dfc-aa29-0f7f35cf0de5.png')
GO
ALTER TABLE [dbo].[tblProducts] ADD  DEFAULT ((0)) FOR [DefaultImageIndex]
GO
ALTER TABLE [dbo].[AspNetRoleClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetRoleClaims] CHECK CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserTokens]  WITH CHECK ADD  CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserTokens] CHECK CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[tblArticleTag]  WITH CHECK ADD  CONSTRAINT [FK_tblArticleTag_tblArticles_ArticleId] FOREIGN KEY([ArticleId])
REFERENCES [dbo].[tblArticles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblArticleTag] CHECK CONSTRAINT [FK_tblArticleTag_tblArticles_ArticleId]
GO
ALTER TABLE [dbo].[tblArticleTag]  WITH CHECK ADD  CONSTRAINT [FK_tblArticleTag_tblTags_TagId] FOREIGN KEY([TagId])
REFERENCES [dbo].[tblTags] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblArticleTag] CHECK CONSTRAINT [FK_tblArticleTag_tblTags_TagId]
GO
ALTER TABLE [dbo].[tblMenus]  WITH CHECK ADD  CONSTRAINT [FK_tblMenus_tblCategories_CategoryId] FOREIGN KEY([CategoryId])
REFERENCES [dbo].[tblCategories] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblMenus] CHECK CONSTRAINT [FK_tblMenus_tblCategories_CategoryId]
GO
ALTER TABLE [dbo].[tblProductEffect]  WITH CHECK ADD  CONSTRAINT [FK_tblProductEffect_tblEffects_EffectId] FOREIGN KEY([EffectId])
REFERENCES [dbo].[tblEffects] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductEffect] CHECK CONSTRAINT [FK_tblProductEffect_tblEffects_EffectId]
GO
ALTER TABLE [dbo].[tblProductEffect]  WITH CHECK ADD  CONSTRAINT [FK_tblProductEffect_tblProducts_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[tblProducts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductEffect] CHECK CONSTRAINT [FK_tblProductEffect_tblProducts_ProductId]
GO
ALTER TABLE [dbo].[tblProductPharmacies]  WITH CHECK ADD  CONSTRAINT [FK_tblProductPharmacies_tblPharmacies_PharmacyId] FOREIGN KEY([PharmacyId])
REFERENCES [dbo].[tblPharmacies] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductPharmacies] CHECK CONSTRAINT [FK_tblProductPharmacies_tblPharmacies_PharmacyId]
GO
ALTER TABLE [dbo].[tblProductPharmacies]  WITH CHECK ADD  CONSTRAINT [FK_tblProductPharmacies_tblProducts_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[tblProducts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductPharmacies] CHECK CONSTRAINT [FK_tblProductPharmacies_tblProducts_ProductId]
GO
ALTER TABLE [dbo].[tblProductStrain]  WITH CHECK ADD  CONSTRAINT [FK_tblProductStrain_tblProducts_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[tblProducts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductStrain] CHECK CONSTRAINT [FK_tblProductStrain_tblProducts_ProductId]
GO
ALTER TABLE [dbo].[tblProductStrain]  WITH CHECK ADD  CONSTRAINT [FK_tblProductStrain_tblStrains_StrainId] FOREIGN KEY([StrainId])
REFERENCES [dbo].[tblStrains] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductStrain] CHECK CONSTRAINT [FK_tblProductStrain_tblStrains_StrainId]
GO
ALTER TABLE [dbo].[tblProductTaste]  WITH CHECK ADD  CONSTRAINT [FK_tblProductTaste_tblProducts_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[tblProducts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductTaste] CHECK CONSTRAINT [FK_tblProductTaste_tblProducts_ProductId]
GO
ALTER TABLE [dbo].[tblProductTaste]  WITH CHECK ADD  CONSTRAINT [FK_tblProductTaste_tblTastes_TasteId] FOREIGN KEY([TasteId])
REFERENCES [dbo].[tblTastes] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductTaste] CHECK CONSTRAINT [FK_tblProductTaste_tblTastes_TasteId]
GO
ALTER TABLE [dbo].[tblProductTerpene]  WITH CHECK ADD  CONSTRAINT [FK_tblProductTerpene_tblProducts_ProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[tblProducts] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductTerpene] CHECK CONSTRAINT [FK_tblProductTerpene_tblProducts_ProductId]
GO
ALTER TABLE [dbo].[tblProductTerpene]  WITH CHECK ADD  CONSTRAINT [FK_tblProductTerpene_tblTerpenes_TerpeneId] FOREIGN KEY([TerpeneId])
REFERENCES [dbo].[tblTerpenes] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[tblProductTerpene] CHECK CONSTRAINT [FK_tblProductTerpene_tblTerpenes_TerpeneId]
GO
ALTER TABLE [dbo].[tblStringResources]  WITH CHECK ADD  CONSTRAINT [FK_tblStringResources_tblLanguages_LanguageId] FOREIGN KEY([LanguageId])
REFERENCES [dbo].[tblLanguages] ([Culture])
GO
ALTER TABLE [dbo].[tblStringResources] CHECK CONSTRAINT [FK_tblStringResources_tblLanguages_LanguageId]
GO
