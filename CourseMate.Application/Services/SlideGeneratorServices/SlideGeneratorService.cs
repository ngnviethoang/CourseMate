using CourseMate.Contracts.DTOs.Instructors;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using Microsoft.Extensions.Logging;
using D = DocumentFormat.OpenXml.Drawing;
using P = DocumentFormat.OpenXml.Presentation;

namespace CourseMate.Application.Services.SlideGeneratorServices;

public class SlideGeneratorService : ISlideGeneratorService
{
    // Color scheme
    private const string PrimaryColor = "1B3A5C"; // Dark blue
    private const string AccentColor = "2E86AB"; // Light blue
    private const string TextColor = "333333"; // Dark gray
    private const string BulletColor = "2E86AB"; // Accent for bullets
    private const string WhiteColor = "FFFFFF";
    private readonly ILogger<SlideGeneratorService> _logger;

    public SlideGeneratorService(ILogger<SlideGeneratorService> logger)
    {
        _logger = logger;
    }

    public Task GenerateAsync(string title, List<OutlineSectionDto> sections, string outputPath,
        CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Generating PowerPoint slide at: {OutputPath}", outputPath);

        string? directory = Path.GetDirectoryName(outputPath);
        if (!string.IsNullOrEmpty(directory))
        {
            Directory.CreateDirectory(directory);
        }

        using PresentationDocument presentationDoc = PresentationDocument.Create(outputPath, PresentationDocumentType.Presentation);

        // Create presentation part
        PresentationPart presentationPart = presentationDoc.AddPresentationPart();
        presentationPart.Presentation = new P.Presentation();

        // Create slide master and layout
        SlideMasterPart slideMasterPart = presentationPart.AddNewPart<SlideMasterPart>();
        SlideLayoutPart slideLayoutPart = slideMasterPart.AddNewPart<SlideLayoutPart>();
        slideMasterPart.SlideMaster = CreateSlideMaster(slideLayoutPart);
        slideLayoutPart.SlideLayout = CreateSlideLayout(slideMasterPart);

        // Create slide ID list
        P.SlideIdList slideIdList = new();
        presentationPart.Presentation.AppendChild(slideIdList);

        // Add slide master ID
        P.SlideMasterIdList slideMasterIdList = new();
        string masterRelId = presentationPart.GetIdOfPart(slideMasterPart);
        slideMasterIdList.Append(new P.SlideMasterId { Id = 2147483648u, RelationshipId = masterRelId });
        presentationPart.Presentation.InsertBefore(slideMasterIdList, slideIdList);

        // Slide size
        presentationPart.Presentation.AppendChild(new P.SlideSize { Cx = 12192000, Cy = 6858000 });
        presentationPart.Presentation.AppendChild(new P.NotesSize { Cx = 6858000, Cy = 9144000 });

        uint slideId = 256;

        // Title slide
        AddSlide(presentationPart, slideLayoutPart, slideIdList, ref slideId,
            CreateTitleSlide(title));

        // Content slides
        foreach (OutlineSectionDto section in sections.OrderBy(s => s.Order))
        {
            cancellationToken.ThrowIfCancellationRequested();
            AddSlide(presentationPart, slideLayoutPart, slideIdList, ref slideId,
                CreateContentSlide(section));
        }

        // Thank you slide
        AddSlide(presentationPart, slideLayoutPart, slideIdList, ref slideId,
            CreateTitleSlide("Thank You!", "Questions?"));

        _logger.LogInformation("Generated {SlideCount} slides", sections.Count + 2);
        return Task.CompletedTask;
    }

    private static void AddSlide(PresentationPart presentationPart, SlideLayoutPart slideLayoutPart,
        P.SlideIdList slideIdList, ref uint slideId, P.Slide slide)
    {
        SlidePart slidePart = presentationPart.AddNewPart<SlidePart>();
        slidePart.Slide = slide;
        slidePart.AddPart(slideLayoutPart);

        slideIdList.Append(new P.SlideId
        {
            Id = slideId++,
            RelationshipId = presentationPart.GetIdOfPart(slidePart)
        });
    }

    private static P.Slide CreateTitleSlide(string title, string? subtitle = null)
    {
        return new P.Slide(
            new P.CommonSlideData(
                new P.Background(
                    new P.BackgroundProperties(
                        new D.SolidFill(new D.RgbColorModelHex { Val = PrimaryColor })
                    )
                ),
                new P.ShapeTree(
                    new P.NonVisualGroupShapeProperties(
                        new P.NonVisualDrawingProperties { Id = 1, Name = "" },
                        new P.NonVisualGroupShapeDrawingProperties(),
                        new P.ApplicationNonVisualDrawingProperties()),
                    new P.GroupShapeProperties(new D.TransformGroup()),
                    // Title
                    CreateTextShape(2, "Title", title,
                        685800, 2286000, 10820400, 1325563,
                        4400, true, WhiteColor, D.TextAlignmentTypeValues.Center),
                    // Subtitle
                    CreateTextShape(3, "Subtitle", subtitle ?? "",
                        685800, 3886200, 10820400, 685800,
                        2000, false, WhiteColor, D.TextAlignmentTypeValues.Center)
                )
            )
        );
    }

    private static P.Slide CreateContentSlide(OutlineSectionDto section)
    {
        List<OpenXmlElement> shapes = new()
        {
            new P.NonVisualGroupShapeProperties(
                new P.NonVisualDrawingProperties { Id = 1, Name = "" },
                new P.NonVisualGroupShapeDrawingProperties(),
                new P.ApplicationNonVisualDrawingProperties()),
            new P.GroupShapeProperties(new D.TransformGroup()),
            // Header bar background
            CreateRectangleShape(10, "HeaderBg",
                0, 0, 12192000, 1000000,
                PrimaryColor),
            // Title text
            CreateTextShape(2, "Title", section.Title,
                457200, 200000, 11277600, 600000,
                2800, true, WhiteColor,
                D.TextAlignmentTypeValues.Left)
        };

        // Build bullet content
        List<D.Paragraph> bulletParagraphs = new();
        foreach (string bullet in section.Bullets)
        {
            bulletParagraphs.Add(CreateBulletParagraph(bullet));
        }

        shapes.Add(CreateBulletShape(3, "Content", bulletParagraphs,
            457200, 1200000, 11277600, 5000000));

        return new P.Slide(
            new P.CommonSlideData(
                new P.ShapeTree(shapes.ToArray())
            )
        );
    }

    private static P.Shape CreateTextShape(uint id, string name, string text,
        int x, int y, int cx, int cy,
        int fontSize, bool bold, string color,
        D.TextAlignmentTypeValues alignment)
    {
        return new P.Shape(
            new P.NonVisualShapeProperties(
                new P.NonVisualDrawingProperties { Id = id, Name = name },
                new P.NonVisualShapeDrawingProperties(),
                new P.ApplicationNonVisualDrawingProperties()),
            new P.ShapeProperties(
                new D.Transform2D(
                    new D.Offset { X = x, Y = y },
                    new D.Extents { Cx = cx, Cy = cy }),
                new D.PresetGeometry(new D.AdjustValueList()) { Preset = D.ShapeTypeValues.Rectangle },
                new D.NoFill()),
            new P.TextBody(
                new D.BodyProperties(),
                new D.ListStyle(),
                new D.Paragraph(
                    new D.ParagraphProperties { Alignment = alignment },
                    new D.Run(
                        new D.RunProperties
                        {
                            Language = "en-US",
                            FontSize = fontSize,
                            Bold = bold,
                            Dirty = false
                        }.Also(rp => rp.AppendChild(new D.SolidFill(new D.RgbColorModelHex { Val = color }))),
                        new D.Text { Text = text }
                    )
                )
            )
        );
    }

    private static P.Shape CreateRectangleShape(uint id, string name,
        int x, int y, int cx, int cy, string fillColor)
    {
        return new P.Shape(
            new P.NonVisualShapeProperties(
                new P.NonVisualDrawingProperties { Id = id, Name = name },
                new P.NonVisualShapeDrawingProperties(),
                new P.ApplicationNonVisualDrawingProperties()),
            new P.ShapeProperties(
                new D.Transform2D(
                    new D.Offset { X = x, Y = y },
                    new D.Extents { Cx = cx, Cy = cy }),
                new D.PresetGeometry(new D.AdjustValueList()) { Preset = D.ShapeTypeValues.Rectangle },
                new D.SolidFill(new D.RgbColorModelHex { Val = fillColor })),
            new P.TextBody(
                new D.BodyProperties(),
                new D.ListStyle(),
                new D.Paragraph())
        );
    }

    private static D.Paragraph CreateBulletParagraph(string text)
    {
        return new D.Paragraph(
            new D.ParagraphProperties(
                    new D.SpaceBefore(new D.SpacingPoints { Val = 600 }),
                    new D.BulletFont { Typeface = "Arial" },
                    new D.CharacterBullet { Char = "•" }
                )
                { Level = 0 },
            new D.Run(
                new D.RunProperties
                {
                    Language = "en-US",
                    FontSize = 1800,
                    Dirty = false
                }.Also(rp => rp.AppendChild(new D.SolidFill(new D.RgbColorModelHex { Val = TextColor }))),
                new D.Text { Text = text }
            )
        );
    }

    private static P.Shape CreateBulletShape(uint id, string name,
        List<D.Paragraph> paragraphs, int x, int y, int cx, int cy)
    {
        P.TextBody textBody = new(
            new D.BodyProperties { Wrap = D.TextWrappingValues.Square },
            new D.ListStyle());
        foreach (D.Paragraph paragraph in paragraphs)
        {
            textBody.AppendChild(paragraph);
        }

        return new P.Shape(
            new P.NonVisualShapeProperties(
                new P.NonVisualDrawingProperties { Id = id, Name = name },
                new P.NonVisualShapeDrawingProperties(),
                new P.ApplicationNonVisualDrawingProperties()),
            new P.ShapeProperties(
                new D.Transform2D(
                    new D.Offset { X = x, Y = y },
                    new D.Extents { Cx = cx, Cy = cy }),
                new D.PresetGeometry(new D.AdjustValueList()) { Preset = D.ShapeTypeValues.Rectangle },
                new D.NoFill()),
            textBody
        );
    }

    private static P.SlideMaster CreateSlideMaster(SlideLayoutPart slideLayoutPart)
    {
        return new P.SlideMaster(
            new P.CommonSlideData(new P.ShapeTree(
                new P.NonVisualGroupShapeProperties(
                    new P.NonVisualDrawingProperties { Id = 1, Name = "" },
                    new P.NonVisualGroupShapeDrawingProperties(),
                    new P.ApplicationNonVisualDrawingProperties()),
                new P.GroupShapeProperties(new D.TransformGroup()))),
            new P.SlideLayoutIdList(new P.SlideLayoutId { Id = 2147483649u, RelationshipId = "rId1" })
        );
    }

    private static P.SlideLayout CreateSlideLayout(SlideMasterPart slideMasterPart)
    {
        return new P.SlideLayout(
            new P.CommonSlideData(new P.ShapeTree(
                new P.NonVisualGroupShapeProperties(
                    new P.NonVisualDrawingProperties { Id = 1, Name = "" },
                    new P.NonVisualGroupShapeDrawingProperties(),
                    new P.ApplicationNonVisualDrawingProperties()),
                new P.GroupShapeProperties(new D.TransformGroup())))
        );
    }
}

/// <summary>
///     Extension to help with fluent OpenXml element configuration
/// </summary>
internal static class OpenXmlExtensions
{
    public static T Also<T>(this T obj, Action<T> action)
    {
        action(obj);
        return obj;
    }
}